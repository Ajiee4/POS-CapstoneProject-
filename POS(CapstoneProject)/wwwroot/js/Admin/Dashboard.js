$(document).ready(function () {
    function loadSalesReport(filterType) {
        $.ajax({
            type: 'POST',
            url: '/DashboardMenu/GetSalesReport', // Update with your controller path
            data: { filterType: filterType },
            success: function (data) {
                console.log(data);
                $('.ranking').empty(); // Clear current leaderboard

                $.each(data, function (index, item) {
                    let card = `
                        <div class="card">
                            <div class="card-header">
                                <h1 class="rank">${index + 1}</h1>
                                <img src="data:image/jpeg;base64,${item.imageBase64}" alt="Avatar">
                                <div class="name">${item.name}</div>
                            </div>
                            <div class="card-body">
                                <h3 class="sold">${item.totalSold}</h3>
                            </div>
                        </div>
                    `;
                    $('.ranking').append(card);
                });
            },
            error: function () {
                alert("Failed to load sales data.");
            }
        });
    }

    let defaultFilterType = 'daily';

    let defaultButton = $('.sortbutton button').filter(function () {
        return $(this).text().trim().toLowerCase() === defaultFilterType;
    });
    defaultButton.addClass('active'); // Set active class on default button
    loadSalesReport(defaultFilterType);
    // Update the active class on button click
    $('.sortbutton button').on('click', function () {
        let filterType = $(this).text().toLowerCase();
        $(this).addClass('active').siblings().removeClass('active');
        loadSalesReport(filterType); // Load sales report with selected filter
    });




    //// Add zooming functionality
    //salesChart.addEventListener('zoomed', function (event) {
    //    // Fetch detailed daily sales data based on the zoom level
    //    fetch(`/Sales/GetDailySales?startDate=${event.startDate}&endDate=${event.endDate}`)
    //        .then(response => response.json())
    //        .then(data => {
    //            const dailyChartMonths = data.map(item => item.Date);
    //            const dailyChartAmounts = data.map(item => item.Amount);

    //            const dailySalesChart = new ApexCharts(document.querySelector("#dailySalesChart"), {
    //                ...chartOptions,
    //                series: [{
    //                    name: 'Daily Sales',
    //                    data: dailyChartAmounts
    //                }],
    //                xaxis: {
    //                    categories: dailyChartMonths // Set the x-axis to display the days
    //                }
    //            });
    //            dailySalesChart.render();
    //        });
    //});
});
