
let selectedFilter = localStorage.getItem('filterReport');
let todate = localStorage.getItem('toDate');
let fromdate = localStorage.getItem('fromdate');
var chart;

function initChart() {
    chart = document.getElementById('bar').getContext('2d');
    chart = new Chart(chart, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateChart(data) {
    if (chart) {
        chart.destroy();
    }
    chart = document.getElementById('bar').getContext('2d');
    chart = new Chart(chart, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

$('.generateReportBtn').click(function (event) {
    let toDate = $('.toDate').val();
    let fromDate = $('.fromDate').val()
    let transactiontype = $('.selectTransactionType').val()
    localStorage.setItem('toDate', toDate);
            localStorage.setItem('fromDate', fromDate);
            localStorage.setItem('filterReport', transactiontype);
            let data = {
                type: transactiontype,
                fromDate: fromDate,
                toDate: toDate
            };
            

    if (transactiontype === 'Sales' || transactiontype === 'Inventory') {
        $.ajax({
            type: 'POST',
            url: '/SalesReportMenu/GetChartData',
            data: data,
            success: function (result) {
                var chartData = result;
                var data = {
                    labels: chartData.labels,
                    datasets: []
                };

                if (transactiontype === 'Sales') {
                    data.datasets.push({
                        label: 'Total Sales',
                        data: chartData.data,
                        backgroundColor: 'rgb(135,62,35)'
                    });
                } else if (transactiontype === 'Inventory') {
                    data.datasets.push({
                        label: 'Stock In',
                        data: chartData.data.map(item => item.totalStockIn),
                        backgroundColor: 'rgba(6, 128, 250, 0.5)'
                    }, {
                        label: 'Stock Out',
                        data: chartData.data.map(item => item.totalStockOut),
                        backgroundColor: 'rgba(255, 0, 0, 0.5)'
                    });
                }

                updateChart(data);
                $('#bar').show();
            },
            error: function (xhr, status, error) {
                alert("Error: " + error + " Error Laoading the data ");
            }
        });
    }
});