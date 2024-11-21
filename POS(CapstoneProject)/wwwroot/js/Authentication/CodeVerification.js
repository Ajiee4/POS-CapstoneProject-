function validateCodeInput() {
    let inputs = document.querySelectorAll('.code-wrapper input');

    inputs.forEach(item => {
        item.addEventListener('input', (event) => {
           
            item.value = item.value.replace(/[^0-9]/g, '');
        });
    });
}
validateCodeInput();
function confirmCode() {
    let inputs = document.querySelectorAll('.code-wrapper input');
    let code = '';
    inputs.forEach(item => {

        code += item.value

    });
   
  
    $('.inputConfirmationCode').val(code);
    $('.confirmCodeForm').submit();
    document.querySelector('.loader-wrapper-login').style.visibility = "visible";

}