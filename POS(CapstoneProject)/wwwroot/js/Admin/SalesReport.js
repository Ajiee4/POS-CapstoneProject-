
let selectedFilter = localStorage.getItem('filterReport');
let todate = localStorage.getItem('toDate');
let fromdate = localStorage.getItem('fromdate');
var mychart;
$('.generateReportBtn').click(function (event) {


    if ($('.selectTransactionType').val() == null || $('.fromDate').val() == '' ||
        $('.toDate').val() == '') {
        Swal.fire({
            text: 'Fill out all information',
            icon: 'error',
            padding: "1em",
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            setTimeout(() => {
                $('.selectTransactionType').focus();
            }, 1500);

        });


    }
    else {
        let toDate = $('.toDate').val();
        let fromDate = $('.fromDate').val()
        let transactiontype = $('.selectTransactionType').val()
        var chart = document.getElementById('bar').getContext('2d');

        localStorage.setItem('toDate', toDate);
        localStorage.setItem('fromDate', fromDate);
        localStorage.setItem('filterReport', transactiontype);
        let data = {
            type: transactiontype,
            fromDate: fromDate,
            toDate: toDate
        };
        console.log(data);
        if (transactiontype === 'Sales') {
            if (mychart) {
                mychart.destroy();
            }
            $.ajax({
                type: 'POST',
                url: '/SalesReportMenu/GetChartData',
                data: data,
                success: function (result) {
                    var chartData = result;
                     mychart = new Chart(chart, {
                        type: 'bar',
                        data: {
                            labels: chartData.labels,
                            datasets: [{
                                label: 'Total Sales',
                                data: chartData.data,
                                backgroundColor: 'rgb(135,62,35)'
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        }
                    });
                    $('#bar').show();
                },
                error: function (xhr, status, error) {
                   alert("Error: " + error + " Error Laoading the data ");
                }
               
            });

        }
        else if (transactiontype === 'Inventory') {
            if (mychart) {
                mychart.destroy();
            }
            $.ajax({
                type: 'POST',
                url: '/SalesReportMenu/GetChartData',
                data: data,
                success: function (result) {
                    var chartData = result;
                    var mychart = new Chart(chart, {
                        type: 'bar',
                        data: {
                            labels: chartData.labels || [],
                            datasets: [{
                                label: 'Stock In',
                                data: (chartData.data && Array.isArray(chartData.data)) ? chartData.data.map(item => item.totalStockIn) : [],
                                backgroundColor: 'rgba(6, 128, 250, 0.5)'
                            }, {
                                label: 'Stock Out',
                                data: (chartData.data && Array.isArray(chartData.data)) ? chartData.data.map(item => item.totalStockOut) : [],
                                backgroundColor: 'rgba(255, 0, 0, 0.5)'
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        }
                    });
                    $('#bar').show();
                },
                error: function (xhr, status, error) {
                    alert("Error: " + error + " Error Laoading the data ");
                }
            });
          
        }
       
      
    }
})