function sendCode() {



    if ($('.inputEmail').val() == '') {
        popUpMessage("Fill out all necessary information", "error");
    }
    else {
        document.querySelector('.loader-wrapper-login').style.visibility = "visible";

        $('#sendCodeForm').submit();
    }
   
}