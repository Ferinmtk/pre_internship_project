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
