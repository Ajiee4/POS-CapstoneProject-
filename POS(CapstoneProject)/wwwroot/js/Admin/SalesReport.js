//set up datatable js
$(document).ready(function () {
    $('.report-table').DataTable({
        "paging": true,
        "searching": true,
        "ordering": false,
        "pageLength": 5
    });

    $('.loader-wrapper').hide();
    $('.report-filter-wrapper').css({
        "visibility": "visible"
    });

    //var d = new Date();
    //var day = ("0" + d.getDate()).slice(-2);
    //var month = ("0" + (d.getMonth() + 1)).slice(-2);

    //var today = d.getFullYear() + "-" + month + "-" + day;
    //document.querySelector('.fromDateReport').value = today;
    //document.querySelector('.toDateReport').value = today;

});
//generate is button is click
$('.generateReportBtn').click(function (event) {


    if ($('.toDateReport').val() == '' || $('.fromDateReport').val() == '' || $('.selectReportType').val() == null) {

        popUpMessage("Fill out all information", "error")
    }
    else {
        $('#salesReportForm').submit();

        let toDate = $('.toDateReport').val();
        let fromDate = $('.fromDateReport').val();
        let reportType = $('.selectReportType').val();

        localStorage.setItem('toDateReport', toDate);
        localStorage.setItem('fromDateReport', fromDate);
        localStorage.setItem('reportType', reportType);
    }
   
});

function reportTypeChange(elem) {
    if (elem.value == "Inventory Report") {
        /*alert("inventory")*/
        document.querySelector('.report-fromdate-wrapper').style.display = "none"
        document.querySelector('.report-todate-wrapper').style.display = "none"
        document.querySelector('.inventory-bytype-wrapper').style.display = "block"
    }
    else  if(elem.value == "Sales Report"){
        document.querySelector('.report-fromdate-wrapper').style.display = "block"
        document.querySelector('.report-todate-wrapper').style.display = "block"
        document.querySelector('.inventory-bytype-wrapper').style.display = "none"
       
    }
}