$('.generateRecordBtn').click(function (event) {
  
   
    if ($('.selectTransactionType').val() == null || $('.fromDateStockMove').val() == '' ||
        $('.toDateStockMove').val() == '' ) {
        Swal.fire({
            text: 'Fill out all information',
            icon: 'error',
            padding: "1em",
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            setTimeout(() => {
                $('.selectTransactionType').focus();
            }, 1000); 
           
        });
      
      
    }
    else {
        alert('hi')
        let toDate = $('.toDateStockMove').val();
        let fromDate = $('.fromDateStockMove').val()

        localStorage.setItem('toDateStockMove', toDate);
        localStorage.setItem('fromDateStockMove', fromDate);

        $('#stockMovementForm').submit();
    }
})