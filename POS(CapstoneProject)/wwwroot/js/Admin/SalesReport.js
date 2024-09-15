
let selectedFilter = localStorage.getItem('filterReport')
$('.selectFilter').val(selectedFilter)

$('.generateReportBtn').click(function () {
  
    let val = $('.selectFilter').val();
    localStorage.setItem('filterReport', val);

    $('#salesReportForm').submit();
})

