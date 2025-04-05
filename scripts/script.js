// Initialize Socket.IO
const socket = io();

// Cart functionality
let cart = [];

// Fetch products from the backend
function fetchProducts() {
    fetch('/products')
        .then(response => response.json())
        .then(data => {
            const products = data.products;
            const productList = document.getElementById('product-list');
            productList.innerHTML = ''; // Clear existing products
            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <img src="${product.image_url}" alt="${product.product_name}" width="150" height="150">
                    <h3>${product.product_name}</h3>
                    <p>Category: ${product.category}</p>
                    <p>Region: ${product.region}</p>
                    <p>Sales: ${product.sales}</p>
                    <p>Profit: $${product.profit}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                `;
                productList.appendChild(productItem);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Add product to cart
function addToCart(productId) {
    fetch('/products')
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.id === productId);
            if (product) {
                cart.push(product);
                updateCartCount();
                updateCartModal();
                alert(`${product.product_name} added to cart!`);
            }
        })
        .catch(error => console.error('Error fetching product:', error));
}

// Update cart count in the header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-items');
    cartCount.textContent = cart.length;
}

// Update cart modal with current cart items
function updateCartModal() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; // Clear existing cart items
    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.textContent = `${item.product_name} - $${item.profit}`;
        cartList.appendChild(cartItem);
    });
}

// Handle checkout
document.getElementById('checkout-button').addEventListener('click', () => {
    cart.forEach(product => {
        fetch('/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id, quantitySold: 1 })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error recording purchase:', error));
    });
    cart = []; // Clear the cart
    updateCartCount();
    updateCartModal();
    alert('Purchase successful!');
});

// Open cart modal
document.querySelector('.cart-icon').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'block';
});

// Close cart modal
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'none';
});

// Fetch products on page load
fetchProducts();

// Listen for real-time updates
socket.on('product_added', (product) => {
    console.log('New product added:', product);
    fetchProducts(); // Refresh the product list
});

socket.on('sale_made', (product) => {
    console.log('Sale made:', product);
    fetchProducts(); // Refresh the product list
});


//Toggle

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}










// FOR LOGINS
$(document).ready(function () {
    function openLoginModal() {
      document.getElementById('loginModal').style.display = 'block';
    }
  
    function closeLoginModal() {
      document.getElementById('loginModal').style.display = 'none';
    }
  
    function openProfileModal() {
      document.getElementById('profileModal').style.display = 'block';
    }
  
    function closeProfileModal() {
      document.getElementById('profileModal').style.display = 'none';
    }
  
    $('#create-account-link').click(function () {
      $('.login-container').hide();
      $('.create-account-container').show();
    });
  
    $('#login-link').click(function () {
      $('.create-account-container').hide();
      $('.login-container').show();
    });
  
    $('#login-form').submit(function (event) {
      event.preventDefault();
      const username = $('#username').val();
      const password = $('#password').val();
  
      fetch('/customer-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Login successful!') {
          alert('Welcome, ' + data.userDetails.fullName);
          $('#profile-name').text(`Name: ${data.userDetails.fullName}`);
          $('#profile-username').text(`Username: ${data.userDetails.username}`);
          $('#profile-email').text(`Email: ${data.userDetails.email}`);
          $('#profile-created-at').text(`Joined: ${new Date(data.userDetails.createdAt).toLocaleDateString()}`);
          // Add other fields as needed
          closeLoginModal();
          openProfileModal();
        } else {
          alert(data.message);
        }
      })
      .catch(error => console.error('Error:', error));
    });
  
    $('#create-account-form').submit(function (event) {
      event.preventDefault();
      const fullName = $('#fullname').val();
      const username = $('#new-username').val();
      const email = $('#email').val();
      const password = $('#new-password').val();
      const verifyPassword = $('#verify-password').val();
  
      if (password !== verifyPassword) {
        alert('Passwords do not match');
        return;
      }
  
      fetch('/create-customer-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName, username, email, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Customer account created successfully!') {
          alert('Account created successfully. Please log in.');
          $('.create-account-container').hide();
          $('.login-container').show();
        } else {
          alert(data.message);
        }
      })
      .catch(error => console.error('Error:', error));
    });
  });
  



  