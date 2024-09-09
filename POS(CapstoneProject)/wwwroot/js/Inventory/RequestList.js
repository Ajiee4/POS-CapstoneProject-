
let requestListUpdate = [];

function popUpMessageInventoryRequest(message, icon) {
    Swal.fire({
        text: message,
        icon: icon,
        padding: "1em",
        showConfirmButton: false,
        timer: 2000
    });
}

function showCardModalss() {
    let cards = document.querySelectorAll('.request-card');
  

    cards.forEach(card => {
        card.addEventListener('click', function () {
            let reqId = card.dataset.id;
            let status = card.dataset.status;
            const requestStoredList = localStorage.getItem('requestList');
            let cardModal = document.querySelector('#requestCardModal');
               
            requestListUpdate = JSON.parse(requestStoredList);        
            cardModal.dataset.id = reqId

            let buttons = cardModal.querySelectorAll('button');
            let inputs = cardModal.querySelectorAll('input');
            if (status == "Pending") {
               
                buttons.forEach(button => {
                    button.style.display = "block";
                });

                inputs.forEach(input => {
                    input.removeAttribute('readonly', true);
                });
            }
            else {
                buttons.forEach(button => {
                    button.style.display = "none";
                });

                inputs.forEach(input => {
                    input.setAttribute('readonly',true);
                });
            }
           
          
        });
    });
}

showCardModalss();



function validateQtyRequest(input) {
  

    input.value = input.value.replace(/[^0-9]/g, '');
  

}


function changeQtyRequest(input) {
   

    let idIngredient = Number(input.dataset.id);
    const request = requestListUpdate.find((item) => item.IngredientId === idIngredient);
    const inputValue = input.value.trim();
    if (!inputValue) {
        input.value = 0;
    }
    request.Quantity = Number(input.value);
    
    localStorage.setItem('requestList', JSON.stringify(requestListUpdate));
   

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
            let requestId = Number(cardmodal.dataset.id);

        
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

            let jsonData = JSON.stringify(requestListUpdate);
            let cardmodal = document.querySelector('#requestCardModal');
            let requestId = Number(cardmodal.dataset.id);

            $('.inputRequestUpdate').val(jsonData);
            $('.inputRequestId').val(requestId);
            $('#FormRequestUpdate').submit();

           
        }

      
    });
});