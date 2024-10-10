let RequestList = [];

//setting up the data table
$(document).ready(function () {

    const storedList = localStorage.getItem('RequestList');
    if (storedList) {
        RequestList = JSON.parse(storedList);
        DisplayRequest();
    }

    $('.inventory-table').DataTable({
        "paging": true,

        "searching": true,
        "ordering": false,
        "pageLength": 5,

    });
    $('.loader-wrapper').hide();
    $('.inventory-wrapper').css({
        "visibility": "visible"
    });

    $('.updateIngredientBtn').tooltip({
        title: function () {
            return $(this).attr('data-tooltip');
        }
    });
});


//clear the inputs when Add Ingredient Modal disappeared
$('#addIngredientModal').on('hidden.bs.modal', function () {
    $('#addIngredientModal .inputIngredientName').val('');
    $('#addIngredientModal .inputMeasurement').val('');
    $('#addIngredientModal .inputThreshold').val('');
});

//call the function when the add ingrediet is click
$('.addIngredientSubmit').click(function () {
    AddIngredient();
});

//function for validating the ingredient and submission of form
function AddIngredient() {
    let ingredientName = document.querySelector('#addIngredientModal .inputIngredientName').value.trim();
    let unitMeasurement = document.querySelector('#addIngredientModal .inputMeasurement').value.trim();  
    let lowStockThreshold = document.querySelector('#addIngredientModal .inputThreshold').value;
    ingredientName = ingredientName.replace(/\s{2,}/g, ' '); //trims the space

    if (ingredientName === '' || unitMeasurement === ''|| lowStockThreshold === '') {
        popUpMessage('Fill out all information', 'error');
        return;
    } 
   
    $('#addIngredientModal .inputIngredientName').val(ingredientName);

    popUpMessageChoice("Do you want to add this ingredient?", '', 'question', 'general-swal-icon', 'general-swal-title', () => { $('#addIngredientForm').submit();});

     
}

//set the default value when the update modal is showed
function DefaultUpdateIngredientModal(id, name, measurement, threshold) {
  
    $('#updateIngredientModal .inputIngredientId').val(id);
    $('#updateIngredientModal .inputIngredientName').val(name);
    $('#updateIngredientModal .inputMeasurement').val(measurement);
    $('#updateIngredientModal .inputThreshold').val(threshold);
  
        
}

//call the function when update submit button is click
$('.updateIngredientSubmit').click(function () {
    updateIngredient();
});

//function for validating the updated ingredient and submission of form
function updateIngredient() {
    let ingredientName = document.querySelector('#updateIngredientModal .inputIngredientName').value.trim();
    let unitMeasurement = document.querySelector('#updateIngredientModal .inputMeasurement').value.trim();   
    let lowStockThreshold = document.querySelector('#updateIngredientModal .inputThreshold').value;

    ingredientName = ingredientName.replace(/\s{2,}/g, ' ');

    if (ingredientName === '' || unitMeasurement === '' || lowStockThreshold === '') {
        popUpMessage('Fill out all information', 'error');
        return;
    }
   
  
    $('#updateIngredientModal .inputIngredientName').val(ingredientName);

    popUpMessageChoice("Do you want to add this ingredient?", '', 'question', 'general-swal-icon', 'general-swal-title', () => { $('#updateIngredientForm').submit(); });
   
}

/*function for toggling the ingredient-list-wrapper*/

function displayModal(name) {
    if (name === 'Request') {

        RequestListToggle();

        const stockOutListWrapper = $('.stock-out-wrapper');
        if (!(stockOutListWrapper.hasClass('closeStockOutList'))) {
            stockOutListWrapper.addClass('closeStockOutList')
        }
    }
    if (name === 'StockOut') {
        StockOutListToggle();

        const requestListWrapper = $('.request-list-wrapper');
        if (!(requestListWrapper.hasClass('closeRequestList'))) {
            requestListWrapper.addClass('closeRequestList')
        }
    }
}
function RequestListToggle() {
     
    const ingredientListWrapper = $('.request-list-wrapper');
    ingredientListWrapper.toggleClass('closeRequestList');

  /*  $('.request-list-wrapper').toggle();*/
    if (ingredientListWrapper.hasClass('closeRequestList')) {
        //$('.inventory-wrapper').css({
        //    'width': '100%'
        //});
        $('.container-all').css({
            'width': '100%'
        });

        $('.request-list-wrapper').css({
            'opacity': '1',
            'transform': 'translateY(0)',
                
        });
          
        setTimeout(() => {
            $('.request-list-wrapper').css({
                'opacity': '0',
                'transform': 'translateY(-20)',

            });
                
        }, 10);

    }
    else {
        $('.container-all').css({
            'width': "calc(100% - 340px)"
        });

        $('.request-list-wrapper').css({
            'opacity': '0',
            'transform': 'translateY(-20)',

        });

        setTimeout(() => {
            $('.request-list-wrapper').css({
                'opacity': '1',
                'transform': 'translateY(0)',

            });

        }, 10);         
    }
}
function StockOutListToggle() {

    const stockOutListWrapper = $('.stock-out-wrapper');
    stockOutListWrapper.toggleClass('closeStockOutList');

    if (stockOutListWrapper.hasClass('closeStockOutList')) {
        $('.container-all').css({
            'width': '100%'
        });

        $('.stock-out-wrapper').css({
            'opacity': '1',
            'transform': 'translateY(0)',

        });

        setTimeout(() => {
            $('.stock-out-wrapper').css({
                'opacity': '0',
                'transform': 'translateY(-20)',

            });

        }, 10);

    }
    else {
        $('.container-all').css({
            'width': "calc(100% - 340px)"
        });

        $('.stock-out-wrapper').css({
            'opacity': '0',
            'transform': 'translateY(-20)',

        });

        setTimeout(() => {
            $('.stock-out-wrapper').css({
                'opacity': '1',
                'transform': 'translateY(0)',

            });

        }, 10);
    }
}

function requestitem(event, id, name, quantity) {

   
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
        return; 
    }
    if (event.target.tagName === 'TR' || event.target.closest('span')) {
        return;
    }

    let product = RequestList.find(item => item.ingredientId === id);

    if (product) {

        product.ingredientQty += quantity;
        popUpMessageToast("success", "Quantity Updated", 270)
    }
    else {
      
        popUpMessageToast("success", "Ingredient Added", 260)

        RequestList.push({
            ingredientId: id,
            ingredientName: name,
            ingredientQty: quantity
        });

                 
    }
    localStorage.setItem('RequestList', JSON.stringify(RequestList));
 
    DisplayRequest();
   
}

function DisplayRequest() {
    const tableBodyRequest = document.querySelector('.request-content-wrapper .styled-table tbody');
    const tableBodyStockOut = document.querySelector('.stock-out-wrapper .styled-table tbody');
    let html = '';
    const storedList = localStorage.getItem('RequestList');
    const RequestList = JSON.parse(storedList); // Parse the stored list

    if (RequestList != null) {
        RequestList.forEach((item) => {
            const truncatedName = item.ingredientName.length > 10 ? `${item.ingredientName.substring(0, 10)}...` : item.ingredientName;
            html +=
                `
                 <tr >
                        <td style="padding: 10px">
                            <div class="x">
                                <img src="/images/delete-black.png"                                   
                                    class="delete-checkout-img" onclick="deleteItem(${item.ingredientId})"/>
                            </div>
                                
                        </td>
                        <td>
                            ${truncatedName}
                        </td>
                        <td> 
                            <input id="ingQuantity" onchange="qtyChange(this)" oninput="validateQuantity(this)" data-id="${item.ingredientId}" value="${item.ingredientQty}"/> 
                            &nbsp;
                        </td>
                    </tr> 
                                 
                `
        });

        tableBodyRequest.innerHTML = (html != null) ? html : "";
        tableBodyStockOut.innerHTML = (html != null) ? html : "";
    } 

   
  
}

function qtyChange(input) {
    let idIngredient = Number(input.dataset.id);
    const ingredient = RequestList.find((item) => item.ingredientId === idIngredient);
    const inputValue = input.value.trim();


    if (!inputValue || inputValue == 0) {
        input.value = 1;
    }
    ingredient.ingredientQty = Number(input.value);
    localStorage.setItem('RequestList', JSON.stringify(RequestList));

}


function validateQuantity(input) {

    input.value = input.value.replace(/[^0-9]/g, '');

}

$('.requestSubmit').click(function () {

    if (RequestList.length == 0) {

        popUpMessageToast('error', 'Request List Empty', 290)

    }
    else {
        popUpMessageChoice("Confirm Request? <br>", '', 'question', 'general-swal-icon', 'general-swal-title', () => {
            let jSonData = JSON.stringify(RequestList);

            $('.requestInput').val(jSonData);
            $('#requestForm').submit();

            RequestList.splice(0);
            localStorage.setItem('RequestList', JSON.stringify(RequestList));
        });
    
    }

});
function deleteItem(id) {

    popUpMessageToast("success", 'Ingredient Deleted', 270)
   
    const index = RequestList.findIndex(item => item.ingredientId === id);
    if (index !== -1) {
        RequestList.splice(index, 1);
        localStorage.setItem('RequestList', JSON.stringify(RequestList));
        DisplayRequest(); 
    }
}
function redirectRequest(url, event) {
    if (event.target.tagName === 'TR' || event.target.closest('span')) {
        location.href = url;
        /*localStorage.setItem('redirectRequest', true);*/
    }
    
}

//clear the request list 
function cancelRequest() {
   

    if (RequestList.length == 0) {
       
        popUpMessageToast('error', 'Request List Empty', 270)
    }
    else {
        popUpMessageToast('success', 'Request List Canceled', 290)
        RequestList.splice(0)
        localStorage.setItem('RequestList', JSON.stringify(RequestList));

        DisplayRequest();
    }
}



function cancelStockOut() {
    
    if (RequestList.length == 0) {
        popUpMessageToast('error', 'Stock Out List Empty', 285)
       
    }
    else {
        popUpMessageToast('success', 'Stock Out Canceled', 275
        )
        RequestList.splice(0)
        localStorage.setItem('RequestList', JSON.stringify(RequestList));
        DisplayRequest();
    }
         
}


function validateUnitMeasurement(input) {
    let inputValue = input.value;

    if (inputValue.match(/[^a-zA-Z ]+/g)) {
        popUpMessageToast('error', 'Only letters are allowed', 305)
    }

    if (inputValue.startsWith(' ')) {
        popUpMessageToast('error', 'Leading spaces are not allowed', 360)
    }

    if (inputValue.match(/\s{2,}/g)) {
        popUpMessageToast('error', 'Double spaces are not allowed', 360)
    }

    inputValue = inputValue.replace(/[^a-zA-Z ]+/g, '');
    inputValue = inputValue.replace(/\s+/g, ' ');
    inputValue = inputValue.trimStart();
    input.value = inputValue;
}
function validateThreshold(input) {
    
    if (input.value.match(/[^0-9]/g)) {
        popUpMessageToast('error', 'Only digits are allowed', 300)
    }
    input.value = input.value.replace(/[^0-9]/g, '');


}
function validateIngredientName(input) {
    let inputValue = input.value;

    if (inputValue.match(/[^a-zA-Z ]+/g)) {
        popUpMessageToast('error', 'Only letters are allowed', 305)
    }

    if (inputValue.startsWith(' ')) {
        popUpMessageToast('error', 'Leading spaces are not allowed', 360)
    }

    if (inputValue.match(/\s{2,}/g)) {
        popUpMessageToast('error', 'Double spaces are not allowed', 360)
    }

    inputValue = inputValue.replace(/[^a-zA-Z ]+/g, '');
    inputValue = inputValue.replace(/\s+/g, ' ');
    inputValue = inputValue.trimStart();
    input.value = inputValue;
}
$('.exitRequest').click(function () {
    RequestListToggle();
});
$('.exitStockOut').click(function () {
    StockOutListToggle();
});


$('.stockOutSubmit').click(function () {
 
    if (RequestList.length == 0) {

        popUpMessageToast('error', 'Stock Out List Empty', 300)

    }
    else {
        let insufficientList = []
        let ingredient = ingredientListQuanti

        //check every ingredients if they are greater than or equal to the stock out quantity
        //if every iteration is true the result is true
        let result = RequestList.every(item => {
            let findIngredient = ingredient.find(s => s.ingredientId == item.ingredientId);
            return findIngredient.quantity >= item.ingredientQty

        });
      
        //iterate the ingredients list and add the ingredients to the array if it is insufficient
        RequestList.forEach(item => {
            let findIngredient = ingredient.find(s => s.ingredientId == item.ingredientId);
            if (!(findIngredient.quantity >= item.ingredientQty)) {
                insufficientList.push(item.ingredientName)
            }
        });
       
        //check if the result
        if (result) {

            popUpMessageChoice("Confirm Stock Out? <br>", '', 'question', 'general-swal-icon', 'general-swal-title', () => {
                /*  submit if the result is true*/
                let jsonData = JSON.stringify(RequestList);

                $('.stockOutInput').val(jsonData);

                $('#stockOutForm').submit();

                RequestList.splice(0);
                localStorage.setItem('RequestList', JSON.stringify(RequestList));
            });
      
        }
        else {
            //show a pop up message if some ingredients are insufficient
            let insufficientListText = insufficientList.map(item => `<li>${item}</li>`).join('');

            if (insufficientList.length > 1) {
                Swal.fire({
                    icon: "error",
                    title: "Insufficient Quantity <br>",
                    html: `
                            <ul class="swal-stockOutInsufficient-html">${insufficientListText}</ul>
                          `,
                    showConfirmButton: false,
                    timer: 2000,
                    padding: "1em",
                    customClass: {
                        icon: 'general-swal-icon',
                        title: 'swal-stockOutInsufficient-title-many general-swal-title',


                    }

                })
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Insufficient Quantity <br>",
                    html: `
                             <ul class="swal-stockOutInsufficient-html">${insufficientListText}</ul>
                          `,
                    showConfirmButton: false,
                    timer: 2000,
                    padding: "1em",
                    customClass: {
                        icon: 'general-swal-icon',
                        title: 'swal-stockOutInsufficient-title-one general-swal-title',
                    }

                })
            }
  
        }
        
    }
   
});

       

