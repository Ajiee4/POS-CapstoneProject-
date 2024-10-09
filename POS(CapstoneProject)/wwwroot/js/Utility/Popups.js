/*Pop up Messages*/




/*Pop up Message with no choices*/

function popUpMessage(message, icon) {
    Swal.fire({
        text: message,
        icon: icon,
        showConfirmButton: false,
        timer: 2000,
    });
}

/*Pop up Message with  choices*/
function popUpMessageChoice(title, message, icon, iconClass, titleClass, callBack) {
    Swal.fire({

        title: title,
        icon: icon,
        iconColor: "#938F8F",
        showCancelButton: true,
        confirmButtonColor: "#006ACD",
        cancelButtonColor: "#F71900",
        confirmButtonText: "Yes",
        customClass: {
            icon: iconClass,
            title: titleClass,
            confirmButton: 'general-swal-confirm-btn',
            cancelButton: 'general-swal-cancel-btn',
            popup: 'general-swal-container' 

        }

    }).then((result) => {

        if (result.isConfirmed) {

            callBack();

        }
    });
}
/*Pop up Message with  no choices located on the top-right*/
function popUpMessageToast(icon, title, width) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        width: width,
        showConfirmButton: false,
        timer: 1500,
        customClass: {
            popup: 'general-toast-container', 
            title: 'general-toast-title',
            icon: 'general-toast-icon'
            

        }

    });
    Toast.fire({
        icon: icon,
        title: title
    });
}
