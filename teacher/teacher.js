document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const password = passwordInput.value;
        if (password === 'your-secret-password') {  // Change 'your-secret-password' to your actual password
            window.location.href = 'teacher.html';
        } else {
            errorMessage.style.display = 'block';
        }
    });
});
