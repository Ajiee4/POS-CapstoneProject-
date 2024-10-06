
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

});

$('.generateReportBtn').click(function (event) {


    if ($('.toDateReport').val() == '' || $('.fromDateReport').val() == '' || $('.selectReportType').val() == '') {

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