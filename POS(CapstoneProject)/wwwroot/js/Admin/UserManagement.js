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

function popUpMessageUser(message, icon) {
    Swal.fire({
        text: message,
        icon: icon,
        padding: "1em",
        showConfirmButton: false,
        timer: 2000
    });
}

$('#addUserModal').on('hidden.bs.modal', function () {

    $('#addUserModal .inputFirstName').val('');
    $('#addUserModal .inputLastName').val('');
    $('#addUserModal .inputEmail').val('');
    $('#addUserModal .inputCellphone').val('');
    $('#addUserModal .inputUsername').val('');
    $('#addUserModal .inputPassword').val('');

});
$('.addUserSubmit').click(function () {
    alert('hi')
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
        popUpMessageUser('Fill out all information', 'error');
        return;
    }

    // Check for valid names (only letters and one space)
    if (!isValidName(firstname) || !isValidName(lastname)) {
        popUpMessageUser('First and Last Names must be valid, and between 2 and 15 characters long', 'error');
        return;
    }

    //if (!isValidCredentials(username) || !isValidCredentials(password)) {
    //    popUpMessageUser('Email must be valid and between 2 and 15 characters long', 'error');
    //    return;
    //}

    // Check for valid email address
    if (!isValidEmail(email)) {
        popUpMessageUser('Invalid email address', 'error');
        $('#addUserModal .inputEmail').focus();
        return;
    }

    if (!isValidCellphone(cellphone)) {
        popUpMessageUser('Please enter a valid 11-digit cellphone number.', 'error');
        $('#addUserModal .inputCellphone').focus();
        return;
    }

    Swal.fire({
        icon: "question",
        title: "Do you want to add this user?",
        iconColor: "#938F8F",
        showCancelButton: true,
        confirmButtonColor: "#006ACD",
        cancelButtonColor: "#F71900",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'swal-addUser-title',
            confirmButton: 'custom-confirm-btn',
            cancelButton: 'custom-cancel-btn'
        }
    }).then((result) => {
        if (result.isConfirmed) {

            $('#addUserForm').submit();

        }
    });
}
function isValidEmail(email) {
    // You can use a regular expression for more robust validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}

function isValidName(name) {
    // Check for only letters, one space, and length between 2 and 15
    return /^[A-Za-z]+\s?[A-Za-z]+$/.test(name) && name.length >= 2 && name.length <= 15;
}
function isValidCredentials(credential) {
    // Check for only letters, one space, and length between 2 and 15
    return /^[A-Za-z]+\s?[A-Za-z]+$/.test(credential) && credential.length >= 2 && credential.length <= 15;
}

function isValidCellphone(cellphone) {
    // Check for 11 digits and only numbers
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
  /*  $('#updateUserModal .selectRole option[value="' + roleid + '"]').prop('selected', true);*/
    
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
  /*  let role = document.querySelector('#updateUserModal .selectRole').value;*/

    if (firstname === '' || lastname === '' || email === '' || cellphone === '' || username === '' || password === '') {
        popUpMessageUser('Fill out all information', 'error');
        return;
    }

    // Check for valid names (only letters and one space)
    if (!isValidName(firstname) || !isValidName(lastname)) {
        popUpMessageUser('First and Last Names must be valid, and between 2 and 15 characters long', 'error');
        return;
    }

    if (!isValidCredentials(username) || !isValidCredentials(password)) {
        popUpMessageUser('Email must be valid and between 2 and 15 characters long', 'error');
        return;
    }

    // Check for valid email address
    if (!isValidEmail(email)) {
        popUpMessageUser('Invalid email address', 'error');
        $('#updateUserModal .inputEmail').focus();
        return;
    }

    if (!isValidCellphone(cellphone)) {
        popUpMessageUser('Please enter a valid 11-digit cellphone number.', 'error');
        $('#updateUserModal .inputCellphone').focus();
        return;
    }

    Swal.fire({
        icon: "question",
        title: "Do you want to update this user?",
        iconColor: "#938F8F", 
        showCancelButton: true,
        confirmButtonColor: "#006ACD",
        cancelButtonColor: "#F71900",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'swal-updateUser-title',
            confirmButton: 'custom-confirm-btn',
            cancelButton: 'custom-cancel-btn'
        }
    }).then((result) => {
        if (result.isConfirmed) {

            $('#updateUserForm').submit();

        }
    });

}

function ArchiveUser(id) {
    Swal.fire({

        title: "Are you sure you want to deactivate this user? <br/>",
        icon: "question",
        iconColor: "#938F8F",
        showCancelButton: true,
        confirmButtonColor: "#006ACD",
        cancelButtonColor: "#F71900",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'swal-archive-user-title',
            confirmButton: 'custom-confirm-btn',
            cancelButton: 'custom-cancel-btn'

        }

    }).then((result) => {

        if (result.isConfirmed) {

            $('.inputArchiveUserId').val(id);
            $('.archiveUserForm').submit();

        }
    });

    
   
}
function UnarchiveUser(id) {
    Swal.fire({
        title: "Are you sure you want to activate this user? <br/>",
        icon: "question",
        iconColor: "#938F8F",
        showCancelButton: true,
        confirmButtonColor: "#006ACD",
        cancelButtonColor: "#F71900",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'swal-unarchive-user-title',
            confirmButton: 'custom-confirm-btn',
            cancelButton: 'custom-cancel-btn'

        }

    }).then((result) => {

        if (result.isConfirmed) {

            $('.inputUnrchiveUserId').val(id);
            $('.unarchiveUserForm').submit();

        }
    });
  
}
function ViewDetails(email, contact, username, password) {
   
    $('#detailsUserModal .detailEmail').val(email);
    $('#detailsUserModal .detailCellNum').val(contact)
    $('#detailsUserModal .detailUsername').val(username);
    $('#detailsUserModal .detailPassword').val(password)
}



