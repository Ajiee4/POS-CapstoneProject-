
//inventory transaction details
let inventoryTransactDetails = [];

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


    inventoryTransactDetails = inventoryDetails;
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

function viewTransaction(elem) {
   
    let transactId = elem.dataset.transactid;
    viewTransactionDetails(transactId);
};


function viewTransactionDetails(id) {
    let tbody = document.querySelector('#viewStockMovementDetails tbody')
    let filteredOutDetails = inventoryTransactDetails.filter(item => item.InventoryTransactId == id)
    let html = '';
    console.log(filteredOutDetails);
    filteredOutDetails.forEach(item => { 
        let qtyMovement = item.Quantity.replace(" ", "");
       
        html += `
            <tr>
                <td>${item.Ingredient.Name}</td>
                <td>${qtyMovement}</td>
                <td>${item.QtyOnHand}</td>
                <td>${item.UpdatedQty}</td>
            </tr>
        `
    });

    tbody.innerHTML = ''
    tbody.innerHTML = html;
}