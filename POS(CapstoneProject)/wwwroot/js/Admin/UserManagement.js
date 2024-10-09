$(document).ready(function () {
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



$('#addUserModal').on('hidden.bs.modal', function () {

    $('#addUserModal .inputFirstName').val('');
    $('#addUserModal .inputLastName').val('');
    $('#addUserModal .inputEmail').val('');
    $('#addUserModal .inputCellphone').val('');
    $('#addUserModal .inputUsername').val('');
    $('#addUserModal .inputPassword').val('');

});
$('.addUserSubmit').click(function () {
  
    AddNewUser();
});

function AddNewUser() {
    let firstname = document.querySelector('#addUserModal .inputFirstName').value;
    let lastname = document.querySelector('#addUserModal .inputLastName').value;
    let email = document.querySelector('#addUserModal .inputEmail').value;
    let cellphone = document.querySelector('#addUserModal .inputCellphone').value;
    let username = document.querySelector('#addUserModal .inputUsername').value;
    let password = document.querySelector('#addUserModal .inputPassword').value;
    /*let role = document.querySelector('#addUserModal .selectRole').value;*/

    if (firstname === '' || lastname === '' || email === '' || cellphone === '' || username === '' || password === '') {
        popUpMessage('Fill out all information', 'error');
        return;
    }

    // Check for valid names (only letters and one space)
    if (!isValidName(firstname) || !isValidName(lastname)) {
        popUpMessage('First and Last Names must be valid, and between 2 and 15 characters long', 'error');
        return;
    }

    //if (!isValidCredentials(username) || !isValidCredentials(password)) {
    //    popUpMessage('Email must be valid and between 2 and 15 characters long', 'error');
    //    return;
    //}

    // Check for valid email address
    if (!isValidEmail(email)) {
        popUpMessage('Invalid email address', 'error');
        $('#addUserModal .inputEmail').focus();
        return;
    }

    if (!isValidCellphone(cellphone)) {
        popUpMessage('Please enter a valid 11-digit cellphone number.', 'error');
        $('#addUserModal .inputCellphone').focus();

        return;
    }

    popUpMessageChoice("Are you sure you want to add this user?", '', 'question', 'general-swal-icon', 'general-swal-title', () => {$('#addUserForm').submit();});

}
function isValidEmail(email) {
    // You can use a regular expression for more robust validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}
// Check for only letters, one space, and length between 2 and 15
function isValidName(name) {
   
    return /^[A-Za-z]+\s?[A-Za-z]+$/.test(name) && name.length >= 2 && name.length <= 15;
}
// Check for only letters, one space, and length between 2 and 15
function isValidCredentials(credential) {
   
    return /^[A-Za-z]+\s?[A-Za-z]+$/.test(credential) && credential.length >= 2 && credential.length <= 15;
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

//Update User
$('.updateUserSubmit').click(function () {
    UpdateUser();
});

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

    // Check for valid names (only letters and one space)
    if (!isValidName(firstname) || !isValidName(lastname)) {
        popUpMessage('First and Last Names must be valid, and between 2 and 15 characters long', 'error');
        return;
    }

    //if (!isValidCredentials(username) || !isValidCredentials(password)) {
    //    popUpMessage('Email must be valid and between 2 and 15 characters long', 'error');
    //    return;
    //}

    // Check for valid email address
    if (!isValidEmail(email)) {
        popUpMessage('Invalid email address', 'error');
        $('#updateUserModal .inputEmail').focus();
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

function validateCellNumber(input) {
    if (input.value.match(/[^0-9]/g)) {
        popUpMessageToast('error', 'Only digits are allowed', 300)
    }
    input.value = input.value.replace(/[^0-9]/g, '');
}
function validateEmail(input) {
    if (input.value.match(/[^a-zA-Z_@.]+/g)) {
        popUpMessageToast('error', 'Invalid Input', 225)
    }
    input.value = input.value.replace(/[^a-zA-Z_@.]+/g, '');
}
function validateEmailChange(input) {
    if (!(input.value.endsWith('@gmail.com'))) {
        popUpMessageToast('error', 'Email should ends with @gmail.com', 395)
        input.value = ''
    }
}

function validateUsername(input) {
    if (input.value.match(/[^a-zA-Z0-9]+/g)) {
        popUpMessageToast('error', 'Only letters and digits are allowed', 305)

    }
    input.value = input.value.replace(/[^a-zA-Z0-9]+/g, '');
}