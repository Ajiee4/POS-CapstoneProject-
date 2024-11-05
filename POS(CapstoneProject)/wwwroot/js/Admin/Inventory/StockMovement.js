//Setup the table
$(document).ready(function () {

    $('.loader-wrapper').hide();
    $('.stock-movement-filter-wrapper').css({
        "visibility": "visible"
    });

    $('.stock-movement-table').DataTable({
        "paging": true,
        "searching": true,
        "ordering": false,
        "pageLength": 5
    });


    var d = new Date();
    var day = ("0" + d.getDate()).slice(-2);
    var month = ("0" + (d.getMonth() + 1)).slice(-2);

    var today = d.getFullYear() + "-" + month + "-" + day;
    document.querySelector('.fromDateStockMove').value = today;
    document.querySelector('.toDateStockMove').value = today;
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