
$(document).ready(function () {
    $('.report-table').DataTable({
        "paging": true,
        "searching": true,
        "ordering": false,
        "pageLength": 5
    });
});
function popUpMessageReport(message, icon) {
    Swal.fire({
        text: message,
        icon: icon,
        showConfirmButton: false,
        timer: 2000,
    });
}



$('.generateReportBtn').click(function (event) {


    if ($('.toDateReport').val() == '' || $('.fromDateReport').val() == '' || $('.selectReportType').val() == '') {

        popUpMessageReport("Fill out all information", "error")
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