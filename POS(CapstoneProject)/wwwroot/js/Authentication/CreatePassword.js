function saveNewPassword() {  
    let newPass = document.querySelector('.newPassword').value.trim();
    let confirmPass = document.querySelector('.confirmPassword').value.trim();

    if (newPass === '' || confirmPass === '') {
        popUpMessage('Fill out all required information', 'error')
    }
    else {

        if (newPass === confirmPass) {
            $('.savePasswordForm').submit();
        }
        else {
            popUpMessage('Password does not match', 'error')
        }
    }
   
}

