let requestListUpdate = [];
$(document).ready(function () {
    $('.stock-movement-table').DataTable({
        "paging": true,
        "ordering": true,
        "searching": true,
        "ordering": false,
        "pageLength": 5,

    });
})


$(document).ready(function () {
    requestListUpdate = requestDetails;
    console.log(requestListUpdate)
  
});

function popUpMessageInventoryRequest(message, icon) {
    Swal.fire({
        text: message,
        icon: icon,
        padding: "1em",
        showConfirmButton: false,
        timer: 2000
    });
}   

$('.viewRequestBtn').click(function () {
   
    if ($('.selectRequestStatus').val() == null || $('.fromDate').val() == '' ||
        $('.toDate').val() == '') {
        Swal.fire({
            text: 'Fill out all information',
            icon: 'error',
            padding: "1em",
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            setTimeout(() => {

                $('.selectRequestStatus').focus();

            }, 1000); 
        });

    }
    else {
        let toDate = $('.toDate').val();
        let fromDate = $('.fromDate').val()

        localStorage.setItem('toDateRequest', toDate);
        localStorage.setItem('fromDateRequest', fromDate);
        $('#requestFilterForm').submit();
    }
});
function ShowRequestModal() {
    let requestCard = document.querySelectorAll('.request-card');
   
 
    requestCard.forEach(card => {
        card.addEventListener('click', function () {
            $('#requestCardModal').modal('show');
           

            let requestID = card.dataset.id;
            let cardModal = document.querySelector('#requestCardModal');
            let tableBody = document.getElementById('requestDetailsTableBody');
           
            cardModal.dataset.requestid = requestID;

            tableBody.innerHTML = '';

            let filteredDetails = requestListUpdate.filter(detail => detail.RequestId == requestID);
            filteredDetails.forEach(deta => {

                const truncatedName = deta.Ingredient.Name.length > 5 ? `${deta.Ingredient.Name.substring(0, 5)}...` : deta.Ingredient.Name;
                let row = `<tr>
                                  <td>${truncatedName}</td>
                                  <td>
                                       <input class="inputQtyRequest" data-requestid="${deta.RequestId}" data-id="${deta.IngredientId}" onchange="changeQtyRequest(this)" oninput="validateQtyRequest(this)" value="${deta.Quantity}" />
                                  </td>
                          </tr>
                          `;
                tableBody.innerHTML += row;
            });

            let buttons = cardModal.querySelectorAll('button');
            let inputs = cardModal.querySelectorAll('input');
            let status = card.dataset.status;

            if (status == "Pending") {

                buttons.forEach(button => {
                    button.style.display = "block";
                });

                inputs.forEach(input => {
                    input.removeAttribute('readonly',true);
                });

            }
            else {
                buttons.forEach(button => {
                    button.style.display = "none";
                });

                inputs.forEach(input => {
                    input.setAttribute('readonly', true);
                });
            }
            

        });
    });
}

ShowRequestModal();

function validateQtyRequest(input) {
  
    input.value = input.value.replace(/[^0-9]/g, '');
  
}


function changeQtyRequest(input) {

    let requestId = Number(input.dataset.requestid);
    let idIngredient = Number(input.dataset.id);
    const request = requestListUpdate.find((item) => item.IngredientId === idIngredient && item.RequestId == requestId);
    const inputValue = input.value.trim();
    if (!inputValue) {
        input.value = 0;
    }
    request.Quantity = Number(input.value);
    console.log(requestListUpdate)
   

}

$('.cancelRequestBtn').click(function () {
    Swal.fire({
        icon: "question",
        title: "Cancel Request? <br>",

        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'swal-updaterequest-title',

        }

    }).then((result) => {

        if (result.isConfirmed) {

           
            let cardmodal = document.querySelector('#requestCardModal');
            let requestId = Number(cardmodal.dataset.requestid);

        
            $('.inputRequestIdcancel').val(requestId);
            $('#FormRequestCancel').submit();


        }


    });
});
$('.completeRequestBtn').click(function () {

    let checkRequest = requestListUpdate.every(item => item.Quantity == 0);
    if (checkRequest) {
        popUpMessageInventoryRequest("All Ingredients' quantities must not be zero","error")
        return;
    }
    Swal.fire({
        icon: "question",
        title: "Complete Request? <br>",

        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'swal-updaterequest-title',

        }

    }).then((result) => {

        if (result.isConfirmed) {
         
          
            let cardmodal = document.querySelector('#requestCardModal');
            let requestId = Number(cardmodal.dataset.requestid);
            let requestList = requestListUpdate.filter(item => item.RequestId == requestId)
            let jsonData = JSON.stringify(requestList);

            $('.inputRequestUpdate').val(jsonData);
            $('.inputRequestId').val(requestId);
            $('#FormRequestUpdate').submit();

           
        }

      
    });
});