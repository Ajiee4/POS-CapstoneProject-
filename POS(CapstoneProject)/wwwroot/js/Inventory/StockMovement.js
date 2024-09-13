$('.generateRecordBtn').click(function (event) {
  
    event.preventDefault();
    if ($('.selectTransactionType').val() == null) {
        Swal.fire({
            text: 'Select a type',
            icon: 'error',
            padding: "1em",
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            setTimeout(() => {
                $('.selectTransactionType').focus();
            }, 1000); // Adjust the delay if necessary
           
        });
      
      
    }
    else {
        $('#stockMovementForm').submit();
    }
})