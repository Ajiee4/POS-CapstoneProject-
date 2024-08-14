
$(document).ready(function () {

    $('#form').submit(function (event) {

        var username = $('.Username').val();
        var password = $('.Password').val();

        $.ajax({
            url: '/Authentication/Login',
            method: 'POST', 
            data: {
                Username: username,
                Password: password
            },
            success: function (response) {
                // Display a popup message based on the response
                alert(response.message);
            },
            error: function (xhr, status, error) {
                // Handle error scenario
                alert("An error occurred: " + error);
            }
        });
    });

});


