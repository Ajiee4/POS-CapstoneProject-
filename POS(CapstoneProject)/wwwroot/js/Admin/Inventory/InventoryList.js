let RequestList = [];

window.addEventListener('load', () => {
    const storedList = localStorage.getItem('RequestList');
    if (storedList) {
        RequestList = JSON.parse(storedList);
        DisplayRequest();
    }
});

//setting up the data table
$(document).ready(function () {
    $('.inventory-table').DataTable({
        "paging": true,

        "searching": true,
        "ordering": false,
        "pageLength": 5,

    });
});


//pop up message
function popUpMessageInventory(message, icon) {
    Swal.fire({
        text: message,
        icon: icon,
        padding: "1em",
        showConfirmButton: false,
        timer: 2000
    });
}
function popUpMessageInvenotryTop(message, icon, mywidth) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        width: mywidth,
        showConfirmButton: false,
        timer: 1500,

    });
    Toast.fire({
        icon: icon,
        title: message
    });
}

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
        popUpMessageInventory('Fill out all information', 'error');
        return;
    }
    if (!isValidName(ingredientName)) {
        popUpMessageInventory("Input ingredient name must be between 3 and 15 characters","error")
        return;
    }
   
    $('#addIngredientModal .inputIngredientName').val(ingredientName);

    Swal.fire({
        icon: "question",
        title: "Do you want to add this ingredient?",
        padding: "1em",
        showCancelButton: true,
        confirmButtonColor: "#1964C5",
        cancelButtonColor: "#F71F1F",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'swal-addIngredient-title',
        }
    }).then((result) => {
        if (result.isConfirmed) {

            $('#addIngredientForm').submit();

        }
    });
    
}

//check if the name is valid
function isValidName(name) {

    if (name.length >= 3 && name.length <= 15) {
        return true;
    }
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
        popUpMessageInventory('Fill out all information', 'error');
        return;
    }
    if (!isValidName(ingredientName)) {
        popUpMessageInventory("Input ingredient name must be between 3 and 15 characters", "error")
        return;
    }
  
    $('#updateIngredientModal .inputIngredientName').val(ingredientName);
    Swal.fire({
        icon: "question",
        title: "Do you want to update this ingredient?",
        padding: "1em",
        showCancelButton: true,
        confirmButtonColor: "#1964C5",
        cancelButtonColor: "#F71F1F",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'swal-updateIngredient-title',
        }
    }).then((result) => {
        if (result.isConfirmed) {

            $('#updateIngredientForm').submit();

        }
    });
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
        $('.inventory-wrapper').css({
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
        $('.inventory-wrapper').css({
            'width': "calc(100% - 370px)"
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
        $('.inventory-wrapper').css({
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
        $('.inventory-wrapper').css({
            'width': "calc(100% - 370px)"
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

    let product = RequestList.find(item => item.ingredientId === id);

    if (product) {

        product.ingredientQty += quantity;
        popUpMessageInvenotryTop("Ingredient Quantity Updated", "success", 300)
    }
    else {
      
        popUpMessageInvenotryTop("Ingredient Added", "success", 300)

        RequestList.push({
            ingredientId: id,
            ingredientName: name,
            ingredientQty: quantity
        });

        // Add the item to the request list
      /*  const row = document.querySelector(`tr[data-id="${id}"]`);*/
            
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

    if (RequestList === null) {
        html +=
            `
             <tr >
                    <td class="table-data-quantity text-center"> Please Click the Desired Ingredients to be Requested</td>
                </tr> 
                                 
            `
    } else {
        RequestList.forEach((item) => {
            const truncatedName = item.ingredientName.length > 10 ? `${item.ingredientName.substring(0, 10)}...` : item.ingredientName;
            html +=
                `
                 <tr >
                        <td style="padding: 10px">
                                <img src="/images/delete-black.png"
                                 onmouseover="hoverElement(this)"
                                onmouseout="leaveElement(this)"
                                class="delete-checkout-img d-block mx-auto" onclick="deleteItem(${item.ingredientId})"/>
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
    }

    tableBodyRequest.innerHTML = html;
    tableBodyStockOut.innerHTML = html;
  
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



function hoverElement(img) {
    img.src = '/images/delete-red.png';
}

function leaveElement(img) {
    img.src = '/images/delete-black.png';
}


$('.requestSubmit').click(function () {

    if (RequestList.length == 0) {

        popUpMessageInvenotryTop('Request List is empty', 'error', 290)

    }
    else {
        Swal.fire({
            icon: "question",
            title: "Confirm Request? <br>",

            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            customClass: {
                icon: 'custom-icon',
                title: 'Confirm',

            }

        }).then((result) => {

            if (result.isConfirmed) {

                let jSonData = JSON.stringify(RequestList);

                $('.requestInput').val(jSonData);

                $('#requestForm').submit();

                RequestList.splice(0);
                localStorage.setItem('RequestList', JSON.stringify(RequestList));

            }
        });
    }

});
function deleteItem(id) {

    popUpMessageInvenotryTop('Ingredient deleted', "success", 300)
    // Implement the logic to delete the item from the RequestList and update the UI
    const index = RequestList.findIndex(item => item.ingredientId === id);
    if (index !== -1) {
        RequestList.splice(index, 1);
        localStorage.setItem('RequestList', JSON.stringify(RequestList));
        DisplayRequest(); // Update the UI
    }
}


//clear the request list 
function cancelRequest() {
    const cancelButton = document.querySelector('.cancelrequest');

    cancelButton.addEventListener('click', () => {

        if (RequestList.length == 0) {
            popUpMessageInventory('Request List is empty', 'error')
        }
        else {
            popUpMessageInvenotryTop('Request List Canceled', 'info', 300)
            RequestList.splice(0)
            localStorage.setItem('RequestList', JSON.stringify(RequestList));

            document.querySelector('.request-list-wrapper table tbody').innerHTML = '';
            document.querySelector('.stock-out-wrapper table tbody').innerHTML = '';
        }
      
    });
}

cancelRequest();

cancelStockOut();
function cancelStockOut() {
    const cancelButton = document.querySelector('.cancelStockOut');

    cancelButton.addEventListener('click', () => {
        if (RequestList.length == 0) {
            
            popUpMessageInventory('Stock Out List is empty', 'error')
        }
        else {
            popUpMessageInvenotryTop('Stock Out List Canceled', 'info', 340)
            RequestList.splice(0)
            localStorage.setItem('RequestList', JSON.stringify(RequestList));

            document.querySelector('.request-list-wrapper table tbody').innerHTML = '';
            document.querySelector('.stock-out-wrapper table tbody').innerHTML = '';
        }
       
    });
}

$('.exitRequest').click(function () {
    RequestListToggle();
});
$('.exitStockOut').click(function () {
    StockOutListToggle();
});


$('.stockOutSubmit').click(function () {
 
    if (RequestList.length == 0) {

        popUpMessageInvenotryTop('Stock Out List is empty', 'error', 300)

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


            Swal.fire({
                icon: "question",
                title: "Confirm Stock Out? <br>",

                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
                customClass: {

                    icon: 'custom-icon',
                    title: 'Confirm',

                }

            }).then((result) => {

                if (result.isConfirmed) {

                    /*  submit if the result is true*/
                    let jsonData = JSON.stringify(RequestList);

                    $('.stockOutInput').val(jsonData);

                    $('#stockOutForm').submit();

                    RequestList.splice(0);
                    localStorage.setItem('RequestList', JSON.stringify(RequestList));

                }
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
                        icon: 'custom-icon',
                        title: 'swal-stockOutInsufficient-title-many',


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
                        icon: 'custom-icon',
                        title: 'swal-stockOutInsufficient-title-one',
                    }

                })
            }
  
        }
        
    }
   
});

       

