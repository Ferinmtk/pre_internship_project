// SIDEBAR TOGGLE
let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}

// LOGIN PAGE REDIRECT
function redirectToLogin() {
  window.location.href = "admin-login.html";
}

// SEARCHBOX TOGGLE
function toggleSearchBox() {
  const searchBox = document.getElementById("search-box");
  searchBox.classList.toggle("hidden");
  if (!searchBox.classList.contains("hidden")) {
    searchBox.focus();
  }
}

// SOCKET.IO SETUP FOR REAL-TIME UPDATES
const socket = io();

socket.on('updateData', (data) => {
  console.log("Received updated data:", data);
  updateCharts(data);
});

// FUNCTION TO UPDATE CHARTS WITH REAL-TIME DATA
function updateCharts(data) {
  if (barChart && areaChart) {
    barChart.updateSeries([{ data: data.sales.map(sale => sale.amount) }]);
    areaChart.updateSeries([
      { name: 'Purchase Orders', data: data.expenses.map(exp => exp.amount) },
      { name: 'Sales Orders', data: data.profit.map(prof => prof.amount) }
    ]);
  }
}

// FUNCTION TO RENDER CHARTS
function renderCharts() {
  if (document.querySelector("#bar-chart")) {
    const barChartOptions = {
      series: [{ data: [10, 8, 6, 4, 2], name: 'Products' }],
      chart: { type: 'bar', background: 'transparent', height: 350 },
      colors: ['#2962ff', '#d50000', '#2e7d32', '#ff6d00', '#583cb3'],
      plotOptions: { bar: { distributed: true, borderRadius: 4, columnWidth: '40%' } },
      xaxis: { categories: ['Snails', 'Plantain', 'Turkey', 'Rabbit', 'Catfish'] },
      tooltip: { theme: 'dark' }
    };

    let barChart = new ApexCharts(document.querySelector("#bar-chart"), barChartOptions);
    barChart.render();
  }

  if (document.querySelector("#area-chart")) {
    const areaChartOptions = {
      series: [
        { name: "Purchase Orders", data: [31, 40, 28, 51, 42, 109, 100] },
        { name: "Sales Orders", data: [11, 32, 45, 32, 34, 52, 41] }
      ],
      chart: { type: "area", background: "transparent", height: 350 },
      colors: ["#00ab57", "#d50000"],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      tooltip: { theme: "dark" }
    };

    let areaChart = new ApexCharts(document.querySelector("#area-chart"), areaChartOptions);
    areaChart.render();
  }
}zzzzzz


// Load Dashboard by Default When Page Loads
document.addEventListener("DOMContentLoaded", function () {
  loadContent("dashboard");
});

// Keep Sidebar Navigation Functional
function loadContent(page) {
  let content = document.getElementById("main-content");

  if (page === "dashboard") {
    content.innerHTML = `
      <!-- Filters Section -->
      <section class="filters">
        <h2>Filter Data</h2>
        <div class="filter-group">
          <label for="start-date">Start Date:</label>
          <input type="date" id="start-date">
          
          <label for="end-date">End Date:</label>
          <input type="date" id="end-date">

          <label for="category">Product Category:</label>
          <select id="category">
            <option value="all">All</option>
            <option value="cocoa">Cocoa</option>
            <option value="plantains">Plantains</option>
          </select>

          <label for="region">Region:</label>
          <select id="region">
            <option value="all">All</option>
            <option value="north">North</option>
            <option value="south">South</option>
          </select>

          <button onclick="applyFilters()">Apply Filters</button>
        </div>
      </section>

      <!-- Summary Cards -->
      <div class="main-cards">
        <div class="card"><div class="card-inner"><h3>PRODUCTS</h3><span class="material-icons-outlined">inventory_2</span></div><h1>249</h1></div>
        <div class="card"><div class="card-inner"><h3>CATEGORIES</h3><span class="material-icons-outlined">category</span></div><h1>25</h1></div>
        <div class="card"><div class="card-inner"><h3>CUSTOMERS</h3><span class="material-icons-outlined">groups</span></div><h1>1500</h1></div>
        <div class="card"><div class="card-inner"><h3>ALERTS</h3><span class="material-icons-outlined">notification_important</span></div><h1>56</h1></div>
      </div>

      <!-- Charts Section -->
      <div class="charts">
        <div class="charts-card"><h2 class="chart-title">Top 5 Products</h2><div id="bar-chart"></div></div>
        <div class="charts-card"><h2 class="chart-title">Purchase and Sales Orders</h2><div id="area-chart"></div></div>
      </div>
    `;

    // Initialize charts after content is loaded
    setTimeout(renderCharts, 100);
        // Initialize report buttons functionality
        document.getElementById("sales-report-btn").addEventListener("click", function () {
          generateReport("sales");
        });
        document.getElementById("product-report-btn").addEventListener("click", function () {
          generateReport("product");
        });
        document.getElementById("profit-report-btn").addEventListener("click", function () {
          generateReport("profit");
        });
        document.getElementById("region-report-btn").addEventListener("click", function () {
          generateReport("region");
        });


  } else if (page === "reports") {
    content.innerHTML = `
      <h2>Reports</h2>
      <div class="report-buttons">
          <button onclick="fetchReport('sales')">Sales Report</button>
          <button onclick="fetchReport('product')">Product Report</button>
          <button onclick="fetchReport('profit')">Profit Report</button>
          <button onclick="fetchReport('region')">Region Report</button>
      </div>
      <div id="report-content">
          <p>Select a report to display data.</p>
      </div>
    `;


    document.getElementById("sales-report-btn").addEventListener("click", function () {
      generateReport("sales");
    });
    document.getElementById("product-report-btn").addEventListener("click", function () {
      generateReport("product");
    });
    document.getElementById("profit-report-btn").addEventListener("click", function () {
      generateReport("profit");
    });
    document.getElementById("region-report-btn").addEventListener("click", function () {
      generateReport("region");
    });

  } else if (page === "products") {
    // Display products section
    content.innerHTML = `
        <h2>Product List</h2>
        <button id="add-product-btn" class="btn-primary">Add New Product</button>
        <table class="styled-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Region</th>
                    <th>Sales</th>
                    <th>Profit</th>
                    <th>Image URL</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="products-tbody">
                <!-- Product rows will be dynamically inserted here -->
            </tbody>
        </table>

        <!-- Add Product Modal -->
        <div id="add-product-modal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('add-product-modal')">&times;</span>
                <h2>Add New Product</h2>
                <form id="add-product-form">
                    <label for="product-name">Product Name:</label>
                    <input type="text" id="product-name" name="product-name" required>

                    <label for="category">Category:</label>
                    <input type="text" id="category" name="category" required>

                    <label for="region">Region:</label>
                    <input type="text" id="region" name="region" required>

                    <label for="sales">Sales:</label>
                    <input type="number" id="sales" name="sales" required>

                    <label for="profit">Profit:</label>
                    <input type="number" id="profit" name="profit" required>

                    <label for="image-url">Image URL:</label>
                    <input type="text" id="image-url" name="image-url" required>

                    <button type="submit" class="btn-primary">Add Product</button>
                </form>
            </div>
        </div>

        <!-- Edit Product Modal -->
        <div id="edit-product-modal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('edit-product-modal')">&times;</span>
                <h2>Edit Product</h2>
                <form id="edit-product-form">
                    <input type="hidden" id="edit-product-id" name="product-id">

                    <label for="edit-product-name">Product Name:</label>
                    <input type="text" id="edit-product-name" name="product-name" required>

                    <label for="edit-category">Category:</label>
                    <input type="text" id="edit-category" name="category" required>

                    <label for="edit-region">Region:</label>
                    <input type="text" id="edit-region" name="region" required>

                    <label for="edit-sales">Sales:</label>
                    <input type="number" id="edit-sales" name="sales" required>

                    <label for="edit-profit">Profit:</label>
                    <input type="number" id="edit-profit" name="profit" required>

                    <label for="edit-image-url">Image URL:</label>
                    <input type="text" id="edit-image-url" name="image-url" required>

                    <button type="submit" class="btn-primary">Save Changes</button>
                </form>
            </div>
        </div>
    `;

    // Fetch and display products
    fetchProducts();

    // Add event listeners
    document.getElementById('add-product-btn').addEventListener('click', () => {
        openModal('add-product-modal');
    });

    document.getElementById('add-product-form').addEventListener('submit', addProduct);
    document.getElementById('edit-product-form').addEventListener('submit', editProduct);

    // Fetch and display products
    fetchProducts();

    // Add event listeners
    document.getElementById('add-product-btn').addEventListener('click', () => {
        openModal('add-product-modal');
    });

    document.getElementById('add-product-form').addEventListener('submit', addProduct);
    document.getElementById('edit-product-form').addEventListener('submit', editProduct);


  } else if (page === "inventory") {
    // Display inventory section
    content.innerHTML = `
      <h2>Inventory Dashboard</h2>
      <div class="inventory-section">
        <div class="inventory-metrics">
          <div class="metric">
            <h3>Pred. Months Until Stock Outage</h3>
            <ul id="stock-outage-list"></ul>
          </div>
          <div class="metric">
            <h3>Stock Check</h3>
            <p id="days-since-check"></p>
            <p id="inventory-accuracy"></p>
          </div>
          <div class="metric">
            <h3>Warehouse</h3>
            <p id="warehouse-utilization"></p>
            <p id="stock-value"></p>
          </div>
          <div class="metric">
            <h3>Returns</h3>
            <p id="returns-to-process"></p>
            <p id="return-rate"></p>
          </div>
        </div>

        <h3>In Stock</h3>
        <table class="styled-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>In Stock</th>
              <th>Avg 30-Day Orders</th>
              <th>Unit Price</th>
            </tr>
          </thead>
          <tbody id="in-stock-tbody">
            <!-- In stock product rows will be dynamically inserted here -->
          </tbody>
        </table>
      </div>
    `;

    // Fetch and display inventory data
    fetchInventoryData();

  } else if (page === "bank") {
    // Display bank section
    content.innerHTML = `
      <h2>Bank Summary</h2>
      <table class="styled-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Sales</th>
            <th>Total Profit</th>
            <th>Total Purchases</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody id="bank-tbody">
          <!-- Bank summary rows will be dynamically inserted here -->
        </tbody>
      </table>
    `;

    // Fetch and display bank summary
    fetchBankSummary();




    





  } else if (page === "customers") {
    // Fetch customers data from the backend
    fetch("/customers")
      .then(response => response.json())
      .then(data => {
        // Display customers and the form
        content.innerHTML = `
          <h2>Customer List</h2>
          <table class="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Member Since</th>
                <th>Purchases</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="customer-table-body">
              ${data.customers.map(customer => `
                <tr>
                  <td>${customer.id}</td>
                  <td>${customer.full_name}</td>
                  <td>${customer.username}</td>
                  <td>${customer.email}</td>
                  <td>${customer.is_active ? 'Active' : 'Inactive'}</td>
                  <td>${new Date(customer.created_at).toLocaleDateString()}</td>
                  <td>${customer.purchases}</td>
                  <td>
                    <button class="delete-btn" data-id="${customer.id}">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <!-- Add Customer Form -->
          <h3>Add New Customer</h3>
          <form id="add-customer-form">
            <label for="full_name">Full Name:</label>
            <input type="text" id="full_name" required>
            
            <label for="username">Username:</label>
            <input type="text" id="username" required>
  
            <label for="email">Email:</label>
            <input type="email" id="email" required>
  
            <label for="password">Password:</label>
            <input type="password" id="password" required>
  
            <label for="status">Status:</label>
            <select id="status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
  
            <button type="submit">Add Customer</button>
          </form>
        `;

        // Handle the form submission to add a new customer
        document.getElementById("add-customer-form").addEventListener("submit", function(event) {
          event.preventDefault();
          
          const fullName = document.getElementById("full_name").value;
          const username = document.getElementById("username").value;
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;
          const status = document.getElementById("status").value;
          
          // Check if password is entered
          if (!password) {
            alert("Password is required!");
            return;
          }
  
          const customerData = {
            full_name: fullName,
            username: username,
            email: email,
            password: password,
            is_active: status === 'active' ? true : false
          };
  
          // Send the new customer data to the server
          fetch("/create-customer-account", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(customerData)
          })
          .then(response => response.json())
          .then(data => {
            // On success, clear the form fields and update the customer list dynamically
            alert("Customer added successfully!");
            
            // Clear the form fields
            document.getElementById("add-customer-form").reset();
  
            // Dynamically add the new customer to the table
            const newCustomer = `
              <tr>
                <td>${data.customer.id}</td>
                <td>${data.customer.full_name}</td>
                <td>${data.customer.username}</td>
                <td>${data.customer.email}</td>
                <td>${data.customer.is_active ? 'Active' : 'Inactive'}</td>
                <td>${new Date(data.customer.created_at).toLocaleDateString()}</td>
                <td>${data.customer.purchases}</td>
                <td>
                  <button class="delete-btn" data-id="${data.customer.id}">Delete</button>
                </td>
              </tr>
            `;
            document.getElementById("customer-table-body").insertAdjacentHTML('beforeend', newCustomer);
          })
          .catch(error => {
            console.error("Error adding customer:", error);
            alert("Error adding customer.");
          });
        });

        // Handle the delete button functionality
        document.querySelectorAll(".delete-btn").forEach(button => {
          button.addEventListener("click", function() {
            const customerId = this.getAttribute("data-id");
            if (confirm("Are you sure you want to delete this customer?")) {
              fetch(`/delete-customer/${customerId}`, {
                method: "DELETE"
              })
              .then(response => response.json())
              .then(data => {
                alert("Customer deleted successfully!");
                // Remove the customer row from the table
                this.closest("tr").remove();
              })
              .catch(error => {
                console.error("Error deleting customer:", error);
                alert("Error deleting customer.");
              });
            }
          });
        });
      })
      .catch(error => {
        console.error("Error loading customers:", error);
        content.innerHTML = "<p>Error loading customer data.</p>";
      });
  }
}



// Function to generate report content dynamically
function generateReport(reportType) {
  const reportContentDiv = document.getElementById("report-content");
  
  // You can fetch the report data here from your backend
  fetch(`/get-${reportType}-report`)
    .then(response => response.json())
    .then(data => {
      let content = "";
      switch (reportType) {
        case "sales":
          content = `<h3>Sales Report</h3><pre>${JSON.stringify(data)}</pre>`;
          break;
        case "product":
          content = `<h3>Product Report</h3><pre>${JSON.stringify(data)}</pre>`;
          break;
        case "profit":
          content = `<h3>Profit Report</h3><pre>${JSON.stringify(data)}</pre>`;
          break;
        case "region":
          content = `<h3>Region Report</h3><pre>${JSON.stringify(data)}</pre>`;
          break;
      }
      reportContentDiv.innerHTML = content;
    })
    .catch(err => {
      console.error("Error fetching report:", err);
      reportContentDiv.innerHTML = "<p>Error fetching report data.</p>";
    });
}







function fetchReport(reportType) {
  fetch(`/get-${reportType}-report`)
      .then(response => response.json())
      .then(data => {
          console.log(`Fetched ${reportType} report:`, data);  // Debugging output
          displayReport(data, reportType);
      })
      .catch(error => console.error(`Error fetching ${reportType} report:`, error));
}

function displayReport(data, type) {
  const reportContent = document.getElementById("report-content");

  if (!reportContent) {
      console.error("Report section not found!");
      return;
  }

  // Extract report data dynamically
  const reportKey = Object.keys(data)[0]; // This gets "sales", "products", "profits", or "regions"
  const reportData = data[reportKey];

  // Validate and check if data exists
  if (!Array.isArray(reportData) || reportData.length === 0) {
      reportContent.innerHTML = `<h3>${type.charAt(0).toUpperCase() + type.slice(1)} Report</h3>
                                 <p>No data available.</p>`;
      return;
  }

  // Generate table dynamically
  let table = `<h3>${type.charAt(0).toUpperCase() + type.slice(1)} Report</h3>
               <table class='styled-table'>
               <thead><tr>`;

  // Extract column headers from first object
  const keys = Object.keys(reportData[0]);
  keys.forEach((key) => {
      table += `<th>${key.replace(/_/g, " ")}</th>`;
  });

  table += "</tr></thead><tbody>";

  // Fill table with rows
  reportData.forEach((row) => {
      table += "<tr>";
      keys.forEach((key) => {
          table += `<td>${row[key]}</td>`;
      });
      table += "</tr>";
  });

  table += "</tbody></table>";

  // Update the report section
  reportContent.innerHTML = table;
}


function fetchInventoryData() {
  fetch('/inventory-data')
    .then(response => response.json())
    .then(data => {
      const stockOutageList = data.stockOutage.map(item => `
        <li>${item.product}: ${item.months} months</li>
      `).join('');
      document.getElementById('stock-outage-list').innerHTML = stockOutageList;

      document.getElementById('days-since-check').textContent = `Days since last check: ${data.stockCheck.daysSinceLastCheck}`;
      document.getElementById('inventory-accuracy').textContent = `Inventory accuracy: ${data.stockCheck.accuracy}%`;

      document.getElementById('warehouse-utilization').textContent = `Warehouse utilization: ${data.warehouse.utilization}%`;
      document.getElementById('stock-value').textContent = `Value of stock: $${data.warehouse.stockValue}M`;

      document.getElementById('returns-to-process').textContent = `Returns to be processed: ${data.returns.toBeProcessed}`;
      document.getElementById('return-rate').textContent = `Return rate: ${data.returns.returnRate}%`;

      const inStockRows = data.inStock.map(product => `
        <tr>
          <td>${product.name}</td>
          <td>${product.inStock}</td>
          <td>${product.avg30DayOrders}</td>
          <td>${product.unitPrice}</td>
        </tr>
      `).join('');
      document.getElementById('in-stock-tbody').innerHTML = inStockRows;
    })
    .catch(error => console.error('Error fetching inventory data:', error));
}


function fetchProducts() {
  fetch('/products')
      .then(response => response.json())
      .then(data => {
          const productsTbody = document.getElementById('products-tbody');
          productsTbody.innerHTML = ''; // Clear existing rows

          data.products.forEach(product => {
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${product.id}</td>
                  <td>${product.product_name}</td>
                  <td>${product.category}</td>
                  <td>${product.region}</td>
                  <td>${product.sales}</td>
                  <td>$${product.profit}</td>
                  <td><img src="${product.image_url}" alt="${product.product_name}" width="50"></td>
                  <td>
                      <button onclick="openEditModal(${product.id})" class="btn-edit">Edit</button>
                      <button onclick="deleteProduct(${product.id})" class="btn-delete">Delete</button>
                  </td>
              `;
              productsTbody.appendChild(row);
          });
      })
      .catch(error => console.error('Error fetching products:', error));
}


function addProduct(event) {
  event.preventDefault();

  const product = {
      product_name: document.getElementById('product-name').value,
      category: document.getElementById('category').value,
      region: document.getElementById('region').value,
      sales: parseInt(document.getElementById('sales').value),
      profit: parseFloat(document.getElementById('profit').value),
      image_url: document.getElementById('image-url').value
  };

  fetch('/add-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
  })
  .then(response => response.json())
  .then(data => {
      closeModal('add-product-modal');
      fetchProducts(); // Refresh the product list
  })
  .catch(error => console.error('Error adding product:', error));
}

function openEditModal(productId) {
  fetch(`/products/${productId}`)
      .then(response => response.json())
      .then(product => {
          document.getElementById('edit-product-id').value = product.id;
          document.getElementById('edit-product-name').value = product.product_name;
          document.getElementById('edit-category').value = product.category;
          document.getElementById('edit-region').value = product.region;
          document.getElementById('edit-sales').value = product.sales;
          document.getElementById('edit-profit').value = product.profit;
          document.getElementById('edit-image-url').value = product.image_url;

          openModal('edit-product-modal');
      })
      .catch(error => console.error('Error fetching product:', error));
}

function editProduct(event) {
  event.preventDefault();

  const product = {
      id: document.getElementById('edit-product-id').value,
      product_name: document.getElementById('edit-product-name').value,
      category: document.getElementById('edit-category').value,
      region: document.getElementById('edit-region').value,
      sales: parseInt(document.getElementById('edit-sales').value),
      profit: parseFloat(document.getElementById('edit-profit').value),
      image_url: document.getElementById('edit-image-url').value
  };

  fetch(`/update-product/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
  })
  .then(response => response.json())
  .then(data => {
      closeModal('edit-product-modal');
      fetchProducts(); // Refresh the product list
  })
  .catch(error => console.error('Error updating product:', error));
}



function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
      fetch(`/delete-product/${productId}`, {
          method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
          fetchProducts(); // Refresh the product list
      })
      .catch(error => console.error('Error deleting product:', error));
  }
}



function fetchProducts() {
  fetch('/products')
      .then(response => response.json())
      .then(data => {
          const productsTbody = document.getElementById('products-tbody');
          productsTbody.innerHTML = ''; // Clear existing rows

          data.products.forEach(product => {
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${product.id}</td>
                  <td>${product.product_name}</td>
                  <td>${product.category}</td>
                  <td>${product.region}</td>
                  <td>${product.sales}</td>
                  <td>$${product.profit}</td>
                  <td><img src="${product.image_url}" alt="${product.product_name}" width="50"></td>
                  <td>
                      <button onclick="openEditModal(${product.id})" class="btn-edit">Edit</button>
                      <button onclick="deleteProduct(${product.id})" class="btn-delete">Delete</button>
                  </td>
              `;
              productsTbody.appendChild(row);
          });
      })
      .catch(error => console.error('Error fetching products:', error));
}

function addProduct(event) {
  event.preventDefault();

  const product = {
      product_name: document.getElementById('product-name').value,
      category: document.getElementById('category').value,
      region: document.getElementById('region').value,
      sales: parseInt(document.getElementById('sales').value),
      profit: parseFloat(document.getElementById('profit').value),
      image_url: document.getElementById('image-url').value
  };

  fetch('/add-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
  })
  .then(response => response.json())
  .then(data => {
      closeModal('add-product-modal');
      fetchProducts(); // Refresh the product list
  })
  .catch(error => console.error('Error adding product:', error));
}

function openEditModal(productId) {
  fetch(`/products/${productId}`)
      .then(response => response.json())
      .then(product => {
          document.getElementById('edit-product-id').value = product.id;
          document.getElementById('edit-product-name').value = product.product_name;
          document.getElementById('edit-category').value = product.category;
          document.getElementById('edit-region').value = product.region;
          document.getElementById('edit-sales').value = product.sales;
          document.getElementById('edit-profit').value = product.profit;
          document.getElementById('edit-image-url').value = product.image_url;

          openModal('edit-product-modal');
      })
      .catch(error => console.error('Error fetching product:', error));
}

function editProduct(event) {
  event.preventDefault();

  const product = {
      id: document.getElementById('edit-product-id').value,
      product_name: document.getElementById('edit-product-name').value,
      category: document.getElementById('edit-category').value,
      region: document.getElementById('edit-region').value,
      sales: parseInt(document.getElementById('edit-sales').value),
      profit: parseFloat(document.getElementById('edit-profit').value),
      image_url: document.getElementById('edit-image-url').value
  };

  fetch(`/update-product/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
  })
  .then(response => response.json())
  .then(data => {
      closeModal('edit-product-modal');
      fetchProducts(); // Refresh the product list
  })
  .catch(error => console.error('Error updating product:', error));
}

function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
      fetch(`/delete-product/${productId}`, {
          method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
          fetchProducts(); // Refresh the product list
      })
      .catch(error => console.error('Error deleting product:', error));
  }
}



function fetchBankSummary() {
  fetch('/bank-summary')
      .then(response => response.json())
      .then(data => {
          const tbody = document.getElementById('bank-tbody');
          tbody.innerHTML = '';

          data.forEach(row => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                  <td>${row.date}</td>
                  <td>$${row.total_sales.toFixed(2)}</td>
                  <td>$${row.total_profit.toFixed(2)}</td>
                  <td>$${row.total_purchases.toFixed(2)}</td>
                  <td>$${row.balance.toFixed(2)}</td>
              `;
              tbody.appendChild(tr);
          });
      })
      .catch(error => console.error('Error fetching bank summary:', error));
}

// Fetch bank summary on page load
fetchBankSummary();

// Update summary in real time
socket.on('sale_made', () => {
  fetchBankSummary();
});