document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const createAccountForm = document.getElementById('create-account-form');
    const createAccountLink = document.getElementById('create-account-link');
    const loginLink = document.getElementById('login-link');

    //customer forms and links 

    // Customer forms and links
    const customerLoginForm = document.getElementById('login-form');
    const customerCreateAccountForm = document.getElementById('create-account-form');
    const customerCreateAccountLink = document.getElementById('create-account-link');
    const customerLoginLink = document.getElementById('login-link');


    // Toggle betweenadmin login and create account forms
    createAccountLink.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.login-container').style.display = 'none';
        document.querySelector('.create-account-container').style.display = 'block';
    });

    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.login-container').style.display = 'block';
        document.querySelector('.create-account-container').style.display = 'none';
    });


    

    // Handle admin login form submission
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json();
            console.log("Response data:", data); // Debugging
    
            if (response.ok && data.token) { 
                localStorage.setItem('token', data.token);
                window.location.href = '/admin.html'; // Redirect only if login is successful
            } else {
                alert(data.message || 'Login failed!'); // Show alert ONLY if login fails
            }
        } catch (error) {
            alert('Server error. Try again later.');
        }
    });
    
    

    // Handle admin create account form submission
    createAccountForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const fullName = document.getElementById('full-name').value;
        const newUsername = document.getElementById('new-username').value;
        const skepid = document.getElementById('skep-id').value;
        const email = document.getElementById('email').value;
        const newPassword = document.getElementById('new-password').value;
        const verifyPassword = document.getElementById('verify-password').value;

        if (newPassword !== verifyPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('/create-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName, newUsername, skepid, email, newPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Account created successfully!');
                window.location.href = '/admin-login.html'; // Use relative URL for redirect
            } else {
                alert(data.message || 'Account creation failed!');
            }
        } catch (error) {
            alert('Server error. Try again later.');
        }
    });




    // Handle customer login form submission
    customerLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/customer-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html'; // Use relative URL for redirect
            } else {
                alert(data.message || 'Login failed!');
            }
        } catch (error) {
            alert('Server error. Try again later.');
        }
    });

    // Handle customer create account form submission
    customerCreateAccountForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const fullName = document.getElementById('fullname').value;
        const username = document.getElementById('new-username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('new-password').value;
        const verifyPassword = document.getElementById('verify-password').value;

        if (password !== verifyPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('/create-customer-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName, username, email, password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Customer account created successfully!');
                window.location.href = '/login.html'; // Use relative URL for redirect
            } else {
                alert(data.message || 'Account creation failed!');
            }
        } catch (error) {
            alert('Server error. Try again later.');
        }
    });
});