function togglePasswordVisibility() {
    const passwordInput = document.getElementById('passwordInput');
    const eyeImage = document.getElementById('eyeImage');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeImage.src = '/images/view.png';
    } else {
        passwordInput.type = 'password';
        eyeImage.src = '/images/hide.png'; 
    }
}