
//dailySales();
//monthlySales();
//yearlySales();

//function dailySales() {
//    var chartDataDaily = @Json.Serialize(ViewData["SalesDaily"]);
//    var barDaily = document.getElementById('barDaily').getContext('2d');
//    var mychartDaily = new Chart(barDaily, {
//        type: 'bar',
//        data: {
//            labels: chartDataDaily.labels,
//            datasets: [{
//                label: 'Total Sales',
//                data: chartDataDaily.data,
//                backgroundColor: 'rgba(6,128,250)'
//            }]
//        },
//        options: {
//            scales: {
//                yAxes: [{
//                    ticks: {
//                        beginAtZero: true
//                    }
//                }]
//            },
//            zoom: {
//                enabled: true,
//                mode: 'xy'
//            },
//            pan: {
//                enabled: true,
//                mode: 'x'
//            }
//        }
//    });
//}
//function monthlySales() {
//    var chartDataMonthly = @Json.Serialize(ViewData["SalesMonthly"]);
//    var barMonthly = document.getElementById('barMonthly').getContext('2d');
//    var mychartMonthly = new Chart(barMonthly, {
//        type: 'bar',
//        data: {
//            labels: chartDataMonthly.labels,
//            datasets: [{
//                label: 'Total Sales',
//                data: chartDataMonthly.data,
//                backgroundColor: 'rgba(6,128,250)'
//            }]
//        },
//        options: {
//            scales: {
//                yAxes: [{
//                    ticks: {
//                        beginAtZero: true
//                    }
//                }]
//            },
//            zoom: {
//                enabled: true,
//                mode: 'xy'
//            },
//            pan: {
//                enabled: true,
//                mode: 'x'
//            }
//        }
//    });
//}

//function yearlySales() {
//    var chartDataYearly = @Json.Serialize(ViewData["SalesYearly"]);
//    var barYearly = document.getElementById('barYearly').getContext('2d');
//    var mychartYearly = new Chart(barYearly, {
//        type: 'bar',
//        data: {
//            labels: chartDataYearly.labels,
//            datasets: [{
//                label: 'Total Sales',
//                data: chartDataYearly.data,
//                backgroundColor: 'rgba(6,128,250)'
//            }]
//        },
//        options: {
//            scales: {
//                yAxes: [{
//                    ticks: {
//                        beginAtZero: true
//                    }
//                }]
//            },
//            zoom: {
//                enabled: true,
//                mode: 'xy'
//            },
//            pan: {
//                enabled: true,
//                mode: 'x'
//            }
//        }
//    });
//}
let selectedFilter = localStorage.getItem('filterReport')
$('.selectFilter').val(selectedFilter)

$('.generateReportBtn').click(function () {
  
    let val = $('.selectFilter').val();
    localStorage.setItem('filterReport', val);

    $('#salesReportForm').submit();
})

