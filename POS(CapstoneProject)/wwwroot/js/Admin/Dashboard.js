
$(document).ready(function () {


    $('[data-toggle="tooltip"]').tooltip();

    $('.loader-wrapper').hide();
    $('.dashboard-wrapper').css({
        "visibility": "visible"
    });
   
});
function filterProdRanking(filterType, elem) {
    document.querySelectorAll('.sortbutton button').forEach(item => {
        item.classList.remove('active');
        elem.classList.add('active');
    })

    if (filterType === "Daily") {
        $('.daily-ranking').show();
        $('.monthly-ranking').hide();
        $('.yearly-ranking').hide();
    }
    else if (filterType === "Monthly") {
        $('.daily-ranking').hide();
        $('.monthly-ranking').show();
        $('.yearly-ranking').hide();
    }
    else if (filterType === "Yearly") {
        $('.daily-ranking').hide();
        $('.monthly-ranking').hide();
        $('.yearly-ranking').show();
    }
   
}