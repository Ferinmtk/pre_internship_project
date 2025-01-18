document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const createAccountForm = document.getElementById('create-account-form');
    const createAccountLink = document.getElementById('create-account-link');
    const loginLink = document.getElementById('login-link');

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

    loginForm.addEventListener('submit', async function(e) {
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

            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = 'admin.html';
            } else {
                alert(data.message || 'Login failed!');
            }
        } catch (error) {
            alert('Server error. Try again later.');
        }
    });

    createAccountForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const firstName = document.getElementById('first-name').value;
        const middleName = document.getElementById('middle-name').value;
        const newUsername = document.getElementById('new-username').value;
        const age = document.getElementById('age').value;
        const country = document.getElementById('country').value;
        const phoneNumber = document.getElementById('phone-number').value;
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
                    firstName, middleName, newUsername, age, country,
                    phoneNumber, email, newPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Account created successfully!');
                // Optionally redirect to the login page or auto-login
                window.location.href = 'admin-login.html';
            } else {
                alert(data.message || 'Account creation failed!');
            }
        } catch (error) {
            alert('Server error. Try again later.');
        }
    });
});
