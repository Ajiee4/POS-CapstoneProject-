$(document).ready(function () {
    //setup the datatable js
    $('.user-table').DataTable({
        "paging": true,

        "searching": true,
        "ordering": false,
        "pageLength": 5,

    });

    $('.loader-wrapper').hide();
    $('.user-wrapper').css({
        "visibility": "visible"
    });

    $('[data-toggle="tooltip"]').tooltip();

    $('.updateUserBtn').tooltip({
        title: function () {
            return $(this).attr('data-tooltip');
        }
    });
    $('.detailsUserBtn').tooltip({
        title: function () {
            return $(this).attr('data-tooltip');
        }
    });
})

//empty the inputs of the add modal when is it close
$('#addUserModal').on('hidden.bs.modal', function () {

    $('#addUserModal .inputFirstName').val('');
    $('#addUserModal .inputLastName').val('');
    $('#addUserModal .inputEmail').val('');
    $('#addUserModal .inputCellphone').val('');
    $('#addUserModal .inputUsername').val('');
    $('#addUserModal .inputPassword').val('');

});
$('.addUserSubmit').click(function () {
  
    AddNewUser(); //call the functiono
});

//add user function
function AddNewUser() {
    let firstname = document.querySelector('#addUserModal .inputFirstName').value;
    let lastname = document.querySelector('#addUserModal .inputLastName').value;
    let email = document.querySelector('#addUserModal .inputEmail').value;
    let cellphone = document.querySelector('#addUserModal .inputCellphone').value;
    let username = document.querySelector('#addUserModal .inputUsername').value;
    let password = document.querySelector('#addUserModal .inputPassword').value;
   

    if (firstname === '' || lastname === '' || email === '' || cellphone === '' || username === '' || password === '') {
        popUpMessage('Fill out all information', 'error');
        return;
    }

    if (!isValidCellphone(cellphone)) {
        popUpMessage('Please enter a valid 11-digit cellphone number.', 'error');    
        return;
    }

    popUpMessageChoice("Are you sure you want to add this user?", '', 'question', 'general-swal-icon', 'general-swal-title', () => {$('#addUserForm').submit();});

}

// Check for 11 digits and only numbers
function isValidCellphone(cellphone) {
   
    return /^\d{11}$/.test(cellphone);
}

//Set default value when clicking the update button
function updateUser(userId,firstname, lastname, email, contact, username, password)
{
    $('#updateUserModal .inputUserId').val(userId)
    $('#updateUserModal .inputFirstName').val(firstname)
    $('#updateUserModal .inputLastName').val(lastname)
    $('#updateUserModal .inputEmail').val(email)
    $('#updateUserModal .inputCellphone').val(contact)
    $('#updateUserModal .inputUsername').val(username)
    $('#updateUserModal .inputPassword').val(password)
     
}

//submit the update modal
$('.updateUserSubmit').click(function () {
    UpdateUser(); //call the function
});

//update user function
function UpdateUser() {
    let firstname = document.querySelector('#updateUserModal .inputFirstName').value;
    let lastname = document.querySelector('#updateUserModal .inputLastName').value;
    let email = document.querySelector('#updateUserModal .inputEmail').value;
    let cellphone = document.querySelector('#updateUserModal .inputCellphone').value;
    let username = document.querySelector('#updateUserModal .inputUsername').value;
    let password = document.querySelector('#updateUserModal .inputPassword').value;
 
    if (firstname === '' || lastname === '' || email === '' || cellphone === '' || username === '' || password === '') {
        popUpMessage('Fill out all information', 'error');
        return;
    }

    if (!isValidCellphone(cellphone)) {
        popUpMessage('Please enter a valid 11-digit cellphone number.', 'error');
        $('#updateUserModal .inputCellphone').focus();
        return;
    }

    popUpMessageChoice("Are you sure you want to update this user?", '', 'question', 'general-swal-icon', 'general-swal-title', () => { $('#updateUserForm').submit(); });
  

}
/*Archive user*/
function ArchiveUser(id) {

    popUpMessageChoice("Are you sure you want to deactivate this user? <br/>", '', 'question', 'general-swal-icon', 'general-swal-title', () => {
        $('.inputArchiveUserId').val(id);
        $('.archiveUserForm').submit();
    });
    
   
}
/*unArchive user*/
function UnarchiveUser(id) {

    popUpMessageChoice("Are you sure you want to activate this user? <br/>", '', 'question', 'general-swal-icon', 'general-swal-title', () => {
        $('.inputUnrchiveUserId').val(id);
        $('.unarchiveUserForm').submit();
    });
 
}

/*Set default values in the Details Modal*/
function ViewDetails(email, contact, username, password) {
   
    $('#detailsUserModal .detailEmail').val(email);
    $('#detailsUserModal .detailCellNum').val(contact)
    $('#detailsUserModal .detailUsername').val(username);
    $('#detailsUserModal .detailPassword').val(password)
}

//toggle the password visibility
function togglePasswordVisibilityUser() {
   
    const passwordInput = document.querySelectorAll('.inputPassword');
    const eyeImage = document.querySelectorAll('.eyeImage');

    passwordInput.forEach((item, index) => {
        if (item.type === 'password') {
            item.type = 'text';
            eyeImage[index].src = '/images/view.png';
        } else {
            item.type = 'password';
            eyeImage[index].src = '/images/hide.png';
        }
    });
  
}
//validate the First Name
function validateFirstName(input) {
    let inputValue = input.value;

    if (inputValue.match(/[^a-zA-Z ]+/g)) {
        popUpMessageToast('error', 'Only letters are allowed', 305)
    }

    if (inputValue.startsWith(' ')) {
        popUpMessageToast('error', 'Leading spaces are not allowed', 360)
    }

    if (inputValue.match(/\s{2,}/g)) {
        popUpMessageToast('error', 'Double spaces are not allowed', 360)
    }

    inputValue = inputValue.replace(/[^a-zA-Z ]+/g, '');
    inputValue = inputValue.replace(/\s+/g, ' ');
    inputValue = inputValue.trimStart();
    input.value = inputValue;
}
//validate the Last Name
function validateLastName(input) {
    let inputValue = input.value;

    if (inputValue.match(/[^a-zA-Z ]+/g)) {
        popUpMessageToast('error', 'Only letters are allowed', 305)
    }

    if (inputValue.startsWith(' ')) {
        popUpMessageToast('error', 'Leading spaces are not allowed', 360)
    }

    if (inputValue.match(/\s{2,}/g)) {
        popUpMessageToast('error', 'Double spaces are not allowed', 360)
    }

    inputValue = inputValue.replace(/[^a-zA-Z ]+/g, '');
    inputValue = inputValue.replace(/\s+/g, ' ');
    inputValue = inputValue.trimStart();
    input.value = inputValue;
}
//validate the Cell Num
function validateCellNumber(input) {
    if (input.value.match(/[^0-9]/g)) {
        popUpMessageToast('error', 'Only digits are allowed', 300)
    }
    input.value = input.value.replace(/[^0-9]/g, '');
}
//validate the Email
function validateEmail(input) {
    if (input.value.match(/[^a-zA-Z_@.]+/g)) {
        popUpMessageToast('error', 'Invalid Input', 225)
    }
    input.value = input.value.replace(/[^a-zA-Z_@.]+/g, '');
}
//validate the Email
function validateEmailChange(input) {
    if (!(input.value.endsWith('@gmail.com'))) {
        popUpMessageToast('error', 'Email should ends with @gmail.com', 395)
        input.value = ''
    }
}
//validate the Username
function validateUsername(input) {
    if (input.value.match(/[^a-zA-Z0-9]+/g)) {
        popUpMessageToast('error', 'Only letters and digits are allowed', 305)

    }
    input.value = input.value.replace(/[^a-zA-Z0-9]+/g, '');
}