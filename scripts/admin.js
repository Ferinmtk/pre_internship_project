document.addEventListener('DOMContentLoaded', function() {
    // Check if the JWT token exists in localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        // If no token, redirect to login page
        window.location.href = 'admin-login.html';
    } else {
        // Validate the token if necessary (optional)
        // You could send a request to your backend to validate the token
        console.log('Logged in as admin');
        
        // Example: Fetch data from the protected route
        fetch('/admin/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': token,  // Send token in the header
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Handle the response data
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

fetch('/admin/dashboard', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,  // Add Bearer prefix if required
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Unauthorized access');
    }
    return response.json();
})
.then(data => console.log(data))
.catch(error => {
    console.error('Error:', error);
    localStorage.removeItem('token');
    window.location.href = 'admin-login.html';
});








let salesChart, productChart, profitChart; // Global chart variables

document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 DOM is fully loaded!");

    const filterButton = document.getElementById("apply-filters-btn");
    if (filterButton) {
        filterButton.addEventListener("click", applyFilters);
    } else {
        console.error("❌ Apply Filters button is missing!");
    }

    renderCharts(); // Initialize charts
});

// ✅ Initialize ApexCharts
function renderCharts() {
    salesChart = new ApexCharts(document.querySelector("#sales-chart"), {
        chart: { type: "line" },
        series: [{ name: "Sales", data: [] }],
        xaxis: { categories: [] }
    });
    salesChart.render();

    productChart = new ApexCharts(document.querySelector("#product-chart"), {
        chart: { type: "bar" },
        series: [{ name: "Products", data: [] }],
        xaxis: { categories: [] }
    });
    productChart.render();

    profitChart = new ApexCharts(document.querySelector("#profit-chart"), {
        chart: { type: "area" },
        series: [{ name: "Profits", data: [] }],
        xaxis: { categories: [] }
    });
    profitChart.render();
}

// ✅ Apply Filters
function applyFilters() {
    console.log("🔍 Checking filter elements...");

    const startDateEl = document.getElementById('start-date');
    const endDateEl = document.getElementById('end-date');
    const categoryEl = document.getElementById('product-category');
    const regionEl = document.getElementById('region');

    if (!startDateEl || !endDateEl || !categoryEl || !regionEl) {
        console.error("❌ One or more filter elements are missing!");
        return;
    }

    const startDate = startDateEl.value;
    const endDate = endDateEl.value;
    const category = categoryEl.value;
    const region = regionEl.value;

    console.log("✅ Applying Filters:", { startDate, endDate, category, region });

    fetchFilteredData({ startDate, endDate, category, region });
}

// ✅ Fetch Filtered Data from API
function fetchFilteredData(params) {
    const queryString = new URLSearchParams(params).toString();

    fetch(`/api/sales?${queryString}`)
        .then(response => response.json())
        .then(data => {
            console.log("📊 API Response Data:", data);
            if (!data.sales || !data.products || !data.profits) {
                console.error("❌ API response does not have expected data!");
                return;
            }
            updateCharts(data);
        })
        .catch(error => console.error("❌ Error fetching data:", error));
}



async function fetchProducts(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();

    try {
        const response = await fetch(`/api/products?${queryString}`);
        const result = await response.json();

        if (result.success) {
            console.log("📦 Product Data:", result.data);
            updateProductCharts(result.data);
        } else {
            console.error("❌ Failed to fetch product data.");
        }
    } catch (error) {
        console.error("❌ Error fetching products:", error);
    }
}

// Update product charts dynamically
function updateProductCharts(data) {
    if (window.productChart) {
        productChart.updateSeries([
            {
                name: "Sales",
                data: data.map(product => ({
                    x: product.product_name,
                    y: product.sales
                }))
            }
        ]);
    } else {
        console.warn("⚠️ Product chart is not initialized yet!");
    }
}

// Fetch data when filters are applied
document.getElementById("apply-filters-btn").addEventListener("click", () => {
    const category = document.getElementById("product-category").value;
    const region = document.getElementById("region").value;
    
    fetchProducts({ category, region });
});




// ✅ Update Charts with New Data
function updateCharts(data) {
    console.log("📊 Updating Charts with:", data);

    if (!salesChart || !productChart || !profitChart) {
        console.warn("⚠️ Charts are not initialized yet!");
        return;
    }

    salesChart.updateSeries([{ data: data.sales }]);
    productChart.updateSeries([{ data: data.products }]);
    profitChart.updateSeries([{ data: data.profits }]);
}







// Function to fetch data based on selected filters
    async function applyFilters() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const category = document.getElementById('product-category').value;
        const region = document.getElementById('region').value;

        // Logic to fetch data and update charts will be added here.
        console.log("Filters Applied: ", { startDate, endDate, category, region });

        // Call API with the filters and update the charts dynamically.
        // Example fetch:
        // const response = await fetch(`your_api_endpoint?startDate=${startDate}&endDate=${endDate}&category=${category}&region=${region}`);
    }






    document.addEventListener("DOMContentLoaded", () => {
        // Load customers when the page loads
        loadCustomers();
      
        // Handle customer form submission
        const addCustomerForm = document.getElementById("add-customer-form");
        addCustomerForm.addEventListener("submit", function (event) {
          event.preventDefault();
      
          const fullName = document.getElementById("full-name").value;
          const username = document.getElementById("username").value;
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;
          const isActive = document.getElementById("is-active").checked;
      
          // Validate form fields
          if (!fullName || !username || !email || !password) {
            alert("Please fill in all fields!");
            return;
          }
      
          const customerData = {
            fullName,
            username,
            email,
            password,
            isActive,
          };
      
          // Show loading state
          const loadingMessage = document.getElementById("loading-message");
          loadingMessage.style.display = "block";
      
          // Send POST request to add the customer
          fetch("/add-customer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(customerData),
          })
            .then((response) => response.json())
            .then((data) => {
              alert("Customer added successfully!");
              loadCustomers(); // Reload customers after adding
              addCustomerForm.reset(); // Reset form fields after successful submission
              loadingMessage.style.display = "none"; // Hide loading state
            })
            .catch((error) => {
              console.error("Error adding customer:", error);
              alert("Failed to add customer");
              loadingMessage.style.display = "none"; // Hide loading state in case of error
            });
        });
      });
      
      // Function to load customers from the backend
      function loadCustomers() {
        fetch("/customers")
          .then((response) => response.json())
          .then((data) => {
            if (data.customers) {
              const customerTable = document.querySelector("#customers-table tbody");
              customerTable.innerHTML = ""; // Clear the table before adding new rows
              data.customers.forEach((customer) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                  <td>${customer.id}</td>
                  <td>${customer.full_name}</td>
                  <td>${customer.username}</td>
                  <td>${customer.email}</td>
                  <td>${customer.is_active ? "Active" : "Inactive"}</td>
                  <td>
                    <button onclick="toggleCustomerStatus(${customer.id}, ${!customer.is_active})">
                      ${customer.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                `;
                customerTable.appendChild(row);
              });
            } else {
              console.error("No customers data received.");
            }
          })
          .catch((err) => {
            console.error("Error loading customer data:", err);
          });
      }
      
      // Function to toggle the customer's active status
      function toggleCustomerStatus(customerId, newStatus) {
        fetch(`/update-customer-status/${customerId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: newStatus }),
        })
          .then((response) => response.json())
          .then((data) => {
            alert("Customer status updated successfully!");
            loadCustomers(); // Reload customers after status update
          })
          .catch((error) => {
            console.error("Error updating customer status:", error);
            alert("Failed to update customer status");
          });
      }






      document.addEventListener("DOMContentLoaded", function () {
        // Event listeners for report buttons
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
      });
      
      // Function to generate a report
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
      
      








async function fetchSales() {
    const response = await fetch('/api/sales');
    const data = await response.json();
    console.log("Sales Data:", data);
}

async function fetchExpenses() {
    const response = await fetch('/api/expenses');
    const data = await response.json();
    console.log("Expenses Data:", data);
}

async function fetchProfit() {
    const response = await fetch('/api/profit');
    const data = await response.json();
    console.log("Profit Data:", data);
}

// Call functions to get real-time data
fetchSales();
fetchExpenses();
fetchProfit();


document.addEventListener("DOMContentLoaded", function () {
    var options = {
        chart: {
            type: "bar",
            height: 350
        },
        series: [
            {
                name: "Sales",
                data: []
            }
        ],
        xaxis: {
            categories: []
        }
    };

    window.productChart = new ApexCharts(document.querySelector("#product-chart"), options);
    productChart.render();

    // Fetch initial data
    fetchProducts();
});




// PRODUCT SIDEBAR LIST
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