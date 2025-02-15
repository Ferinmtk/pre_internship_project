console.log('🚀 Server is starting...');

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();
const path = require('path');
const { exec } = require("child_process");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

// PostgreSQL setup with SSL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Allow SSL connection
    },
});

pool.connect()
    .then(() => console.log("✅ PostgreSQL connected successfully!"))
    .catch(err => console.error("❌ PostgreSQL connection error:", err));

// Database Backup File
const FILE_URL = "https://drive.google.com/uc?export=download&id=17qjkjQBS_lfu3Zkyc4ErkRfqF-ZnZ7e4";
const BACKUP_FILE = path.join(__dirname, "tera_backup.sql"); 

const downloadFile = () => {
    console.log("📥 Downloading backup file...");
    exec(`wget --no-check-certificate '${FILE_URL}' -O ${BACKUP_FILE}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error downloading file: ${error.message}`);
            console.error(`💬 stderr: ${stderr}`);
            return;
        }
        console.log("✅ Backup file downloaded successfully!");
        restoreDB();
    });
};

// Restore the Database
const dbUrl = new URL(process.env.DATABASE_URL);
const DB_HOST = dbUrl.hostname;
const DB_USER = dbUrl.username;
const DB_NAME = dbUrl.pathname.substring(1); 
const DB_PASSWORD = dbUrl.password;

const restoreDB = () => {
    console.log("🚀 Starting database restore...");
    console.log(`📂 Using backup file: ${BACKUP_FILE}`);

    exec(
        `PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} -f ${BACKUP_FILE}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error restoring database: ${error.message}`);
                console.error(`💬 stderr: ${stderr}`);
                return;
            }
            console.log("✅ Database restored successfully!");
            console.log(`📝 stdout: ${stdout}`);
        }
    );
};

// 🟢 Start Express Server After Database Restore
server.listen(3000, () => {
    console.log('✅ Server is running on port 3000');
});

// 🟢 Run Backup Restoration in Background
downloadFile();


// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

// Middleware for validating JWT token (LOGIN SYSTEM UNCHANGED)
const validateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

// Route for the root path to serve the login page (UNCHANGED)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-login.html'));
});

// Route to get all customers
app.get('/customers', (req, res) => {
    const query = 'SELECT * FROM customers';
    
    pool.query(query)
      .then(result => {
        res.status(200).json({ customers: result.rows });
      })
      .catch(err => {
        console.error('Error fetching customers:', err.message);  // Log the error message
        res.status(500).json({ message: 'Error fetching customers', error: err.message });
      });
});

//for InVENTORY
app.get('/inventory-data', async (req, res) => {
    try {
      const stockOutage = await pool.query(`
        SELECT 
          product_name AS product,
          ROUND(SUM(quantity) / AVG(daily_sales), 2) AS months
        FROM inventory
        GROUP BY product_name
      `);
  
      const stockCheck = {
        daysSinceLastCheck: 42, // Example value
        accuracy: 99.1 // Example value
      };
  
      const warehouse = {
        utilization: 81, // Example value
        stockValue: 4.25 // Example value in millions
      };
  
      const returns = {
        toBeProcessed: 43, // Example value
        returnRate: 2.9 // Example value in percentage
      };
  
      const inStock = await pool.query(`
        SELECT 
          product_name AS name,
          quantity AS inStock,
          AVG(daily_sales) AS avg30DayOrders,
          unit_price AS unitPrice
        FROM inventory
        GROUP BY product_name, quantity, unit_price
      `);
  
      res.json({
        stockOutage: stockOutage.rows,
        stockCheck,
        warehouse,
        returns,
        inStock: inStock.rows
      });
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      res.status(500).json({ message: 'Error fetching inventory data' });
    }
  });
  
  


  
// Route to handle adding a new customer with active status
app.post('/add-customer', async (req, res) => {
    const { full_name, username, email, password, is_active } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required!' });
    }

    try {
        // Hash the password before inserting
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO customers (full_name, username, email, password, is_active)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const values = [full_name, username, email, hashedPassword, is_active];

        pool.query(query, values)
            .then(result => {
                res.status(201).json({ message: 'Customer added successfully', customer: result.rows[0] });
            })
            .catch(err => {
                console.error('Error adding customer:', err);
                res.status(500).json({ message: 'Error adding customer', error: err });
            });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Error processing password', error: error.message });
    }
});


// Route to handle updating a customer's active status
app.put('/update-customer-status/:id', (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
  
    const query = `
      UPDATE customers
      SET is_active = $1
      WHERE id = $2 RETURNING *;
    `;
    const values = [isActive, id];
  
    pool.query(query, values)
      .then(result => {
        res.status(200).json({ message: 'Customer status updated successfully', customer: result.rows[0] });
      })
      .catch(err => {
        console.error('Error updating customer status:', err);
        res.status(500).json({ message: 'Error updating customer status', error: err });
      });
});

// Route for creating a new admin account
app.post('/create-account', async (req, res) => {
    const {
        fullName,
        newUsername,
        skep_id,
        email,
        newPassword,
    } = req.body;

    try {
        // Check if the username or email already exists
        const existingUser = await pool.query('SELECT * FROM admins WHERE username = $1 OR email = $2', [newUsername, email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists!' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Insert the new admin into the database
        await pool.query(
            'INSERT INTO admins (full_name, username, tera_id, email, password) VALUES ($1, $2, $3, $4, $5)',
            [fullName, newUsername, skep_id, email, hashedPassword]
        );

        res.status(200).json({ message: 'Account created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
});

// Route for creating a customer account
app.post('/create-customer-account', async (req, res) => {
    const { fullName, username, email, password } = req.body;

    try {
        // Check if the username or email already exists
        const existingCustomer = await pool.query('SELECT * FROM customers WHERE username = $1 OR email = $2', [username, email]);

        if (existingCustomer.rows.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists!' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new customer into the database
        await pool.query(
            'INSERT INTO customers (full_name, username, email, password, created_at, updated_at, is_active) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true)',
            [fullName, username, email, hashedPassword]
        );

        res.status(200).json({ message: 'Customer account created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!', error: error.message });

    }
});

// Deleting customers
app.delete('/delete-customer/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM customers WHERE id = $1', [id]);
      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ message: 'Error deleting customer' });
    }
  });
  

// Route admin for logging in
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username exists
        const userResult = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Username or password is incorrect!' });
        }

        const user = userResult.rows[0];

        // Compare password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Username or password is incorrect!' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        // Send token to the frontend
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
});

// Route for customer login
app.post('/customer-login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM customers WHERE username = $1', [username]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Username or password is incorrect!' });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Username or password is incorrect!' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: 'Login successful!',
            token,
            userDetails: {
                fullName: user.full_name,
                username: user.username,
                email: user.email,
                createdAt: user.created_at,
                // Add other fields as needed
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
});


// REPORT SIDEBARLIST REPORT
// sales reports 

app.get("/get-sales-report", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM sales"); // Adjust table name if needed
        res.json({ sales: result.rows });
    } catch (error) {
        console.error("Error fetching sales report:", error);
        res.status(500).json({ message: "Error fetching sales report" });
    }
});

app.get("/get-product-report", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products"); // Adjust table name if needed
        res.json({ products: result.rows });
    } catch (error) {
        console.error("Error fetching product report:", error);
        res.status(500).json({ message: "Error fetching product report" });
    }
});

// profit reports 
// Fetch product profits
app.get('/get-profit-report', async (req, res) => {
    try {
        const query = `
            SELECT product_name, category, region, sales, profit 
            FROM products
            ORDER BY profit DESC;
        `;
        const result = await pool.query(query);
        res.json({ profits: result.rows });
    } catch (error) {
        console.error('Error fetching profit report:', error);
        res.status(500).json({ error: 'Failed to fetch profit report.' });
    }
});

// region reorts 
// Fetch region-based report
app.get('/get-region-report', async (req, res) => {
    try {
        const query = `
            SELECT region, product_name, category, SUM(sales) AS total_sales, SUM(profit) AS total_profit
            FROM products
            GROUP BY region, product_name, category
            ORDER BY region ASC;
        `;
        const result = await pool.query(query);
        res.json({ regions: result.rows });
    } catch (error) {
        console.error('Error fetching region report:', error);
        res.status(500).json({ error: 'Failed to fetch region report.' });
    }
});



// REPORT SIDEBARLIST REPORTS

app.get("/get-products", async (req, res) => {
    try {
        const query = `
            SELECT id, product_name, category, region, sales, profit 
            FROM products
            ORDER BY sales DESC
        `;
        const result = await pool.query(query);
        res.json({ products: result.rows });
    } catch (error) {
        console.error("Error fetching product data:", error);
        res.status(500).json({ error: "Failed to fetch product data." });
    }
});



//fetching images

app.use('/images', express.static(path.join(__dirname, 'images')));



// Route to get all products for both dashboard & eCommerce site
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
        res.status(200).json({ products: result.rows });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Route to add a new product (dashboard & eCommerce)
app.post('/add-product', (req, res) => {
    const { product_name, category, region, sales, profit, image_url } = req.body;
    const query = `
        INSERT INTO products (product_name, category, region, sales, profit, image_url)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const values = [product_name, category, region, sales, profit, image_url];

    pool.query(query, values)
        .then(result => {
            io.emit('product_added', result.rows[0]); // Notify all pools
            res.status(201).json(result.rows[0]);
        })
        .catch(error => {
            console.error('Error adding product:', error);
            res.status(500).json({ error: 'Failed to add product' });
        });
});

// Route to update product details
app.put('/update-product/:id', (req, res) => {
    const { id } = req.params;
    const { product_name, category, region, sales, profit, image_url } = req.body;
    const query = `
        UPDATE products
        SET product_name = $1, category = $2, region = $3, sales = $4, profit = $5, image_url = $6
        WHERE id = $7 RETURNING *;
    `;
    const values = [product_name, category, region, sales, profit, image_url, id];

    pool.query(query, values)
        .then(result => {
            io.emit('product_updated', result.rows[0]); // Notify all pools
            res.status(200).json(result.rows[0]);
        })
        .catch(error => {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Failed to update product' });
        });
});

/*Delete Product*/
app.delete('/delete-product/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *;';
    const values = [id];

    pool.query(query, values)
        .then(result => {
            io.emit('product_deleted', result.rows[0]); // Notify all pools
            res.status(200).json(result.rows[0]);
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Failed to delete product' });
        });
});


// Route for eCommerce to update sales after a purchase
app.post('/purchase', async (req, res) => {
    try {
        const { productId, quantitySold } = req.body;

        const query = `
            UPDATE products 
            SET sales = sales + $1 
            WHERE id = $2 RETURNING *;
        `;
        const values = [quantitySold, productId];

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            // Emit real-time update to dashboard
            io.emit('sale_made', result.rows[0]);

            res.status(200).json({ message: 'Purchase recorded', product: result.rows[0] });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error recording sale:', error);
        res.status(500).json({ message: 'Failed to record sale' });
    }
});





io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    // Listen for new product additions from eCommerce or dashboard
    socket.on('product_added', async (product) => {
        try {
            const { productName, category, region, sales, profit, imageUrl } = product;

            // Validate required fields
            if (!productName || !category || !region || sales === undefined || profit === undefined) {
                return socket.emit('error', { message: 'Invalid product data' });
            }

            const query = `
                INSERT INTO products (product_name, category, region, sales, profit, image_url) 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
            `;
            const values = [productName, category, region, sales, profit, imageUrl];

            const result = await pool.query(query, values);

            io.emit('product_added', result.rows[0]); // Broadcast to all pools
        } catch (error) {
            console.error('Error adding product:', error);
            socket.emit('error', { message: 'Failed to add product' });
        }
    });

    // Listen for product updates
    socket.on('product_updated', async (product) => {
        try {
            const { id, productName, category, region, sales, profit, imageUrl } = product;

            // Validate required fields
            if (!id || !productName || !category || !region || sales === undefined || profit === undefined) {
                return socket.emit('error', { message: 'Invalid product update data' });
            }

            const query = `
                UPDATE products 
                SET product_name = $1, category = $2, region = $3, sales = $4, profit = $5, image_url = $6
                WHERE id = $7 RETURNING *;
            `;
            const values = [productName, category, region, sales, profit, imageUrl, id];

            const result = await pool.query(query, values);
            if (result.rows.length > 0) {
                io.emit('product_updated', result.rows[0]); // Broadcast update
            } else {
                socket.emit('error', { message: 'Product not found' });
            }
        } catch (error) {
            console.error('Error updating product:', error);
            socket.emit('error', { message: 'Failed to update product' });
        }
    });

    // Listen for sales made on eCommerce site
    socket.on('sale_made', async ({ productId, quantitySold }) => {
        try {
            // Validate required fields
            if (!productId || quantitySold === undefined || quantitySold <= 0) {
                return socket.emit('error', { message: 'Invalid sale data' });
            }

            const query = `
                UPDATE products 
                SET sales = sales + $1 
                WHERE id = $2 RETURNING *;
            `;
            const values = [quantitySold, productId];

            const result = await pool.query(query, values);
            if (result.rows.length > 0) {
                io.emit('sale_made', result.rows[0]); // Notify all pools
            } else {
                socket.emit('error', { message: 'Product not found' });
            }
        } catch (error) {
            console.error('Error updating sales:', error);
            socket.emit('error', { message: 'Failed to update sales' });
        }
    });

    socket.on('disconnect', () => {
        console.log('pool disconnected');
    });
});






// Serve static files (UNCHANGED)
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname)));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
