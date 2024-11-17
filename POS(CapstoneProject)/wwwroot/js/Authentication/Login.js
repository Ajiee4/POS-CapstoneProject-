function loginAccount() {

    if ($('.Password').val() == '' || $('.Username').val() == '') {
        popUpMessage("Fill out all necessary information", "error");
    }
    else {
        $('#loginForm').submit();
        document.querySelector('.loader-wrapper-login').style.visibility = "visible";
    }

 
};