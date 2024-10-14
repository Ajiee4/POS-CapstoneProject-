//Setup the table
$(document).ready(function () {

    $('.loader-wrapper').hide();
    $('.stock-movement-filter-wrapper').css({
        "visibility": "visible"
    });

});


//when geenrate record is click
$('.generateRecordBtn').click(function (event) {
  
   
    if ($('.selectTransactionType').val() == null || $('.fromDateStockMove').val() == '' || $('.toDateStockMove').val() == '') {

        popUpMessage("Fill out all information", "error")
          
    }
    else {
     
        let toDate = $('.toDateStockMove').val();
        let fromDate = $('.fromDateStockMove').val()

        localStorage.setItem('toDateStockMove', toDate);
        localStorage.setItem('fromDateStockMove', fromDate);

        $('#stockMovementForm').submit();
    }
})