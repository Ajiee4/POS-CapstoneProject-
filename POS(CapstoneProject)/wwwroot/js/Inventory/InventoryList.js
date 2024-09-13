let ingredientList = [];




//setting up the data table
$(document).ready(function () {
    $('.inventory-table').DataTable({
        "paging": true,

        "searching": true,
        "ordering": false,
        "pageLength": 5,

    });
})
$(document).ready(function () {
    $('.stock-movement-table').DataTable({
        "paging": true,

        "searching": true,
        "ordering": false,
        "pageLength": 5,

    });
})
$(document).ready(function () {
    $('.request-details-table').DataTable({
        "paging": true,

        "searching": true,
        "ordering": false,
        "pageLength": 5,

    });
})


//function for showing pop up message
function popUpMessageInventory(message, icon) {
    Swal.fire({
        text: message,
        icon: icon,
        padding: "1em",
        showConfirmButton: false,
        timer: 2000
    });
}

//cost per unit validation
function validateInput(input) {
    const value = input.value;
    if (!/^[0-9]+(\.[0-9])?$/.test(value)) {
        input.value = value.replace(/[^\d\.]/g, ''); 
    }
}


$('.addIngredientSubmit').click(function () {
    AddIngredient();
});

$('#addIngredientModal').on('hidden.bs.modal', function () {
    $('#addIngredientModal .inputIngredientName').val('');
    $('#addIngredientModal .inputMeasurement').val('');
    $('#addIngredientModal .inputThreshold').val('');
});

function AddIngredient() {
    let ingredientName = document.querySelector('#addIngredientModal .inputIngredientName').value.trim();
    let unitMeasurement = document.querySelector('#addIngredientModal .inputMeasurement').value.trim();  
    let lowStockThreshold = document.querySelector('#addIngredientModal .inputThreshold').value;
    ingredientName = ingredientName.replace(/\s{2,}/g, ' ');

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


//set the default value when the modal is showed
function DefaultUpdateIngredientModal(id, name, measurement, threshold) {
  
    $('#updateIngredientModal .inputIngredientId').val(id);
    $('#updateIngredientModal .inputIngredientName').val(name);
    $('#updateIngredientModal .inputMeasurement').val(measurement);
    $('#updateIngredientModal .inputThreshold').val(threshold);
  
        
}
//call the function when button is click
$('.updateIngredientSubmit').click(function () {
    updateIngredient();
});

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

function IngredientListToggle() {
    $('.ingredient-list-wrapper').slideToggle(1000, function () {

        const ingredientListWrapper = $('.ingredient-list-wrapper');
        ingredientListWrapper.toggleClass('closeIngredientList');

        if (ingredientListWrapper.hasClass('closeIngredientList')) {
            $('.inventory-wrapper').css({
                'width': '100%'
            })
        } else {
            $('.inventory-wrapper').css({
                'width': "calc(100% - 320px)"
            })
        }

    });
}
$('.selectProcess').change(function () {
    
})

$('.requestIngredientBtn').click(function () {
  
    
    let wrapper = document.querySelector('.ingredient-list-wrapper');
    if (wrapper.classList.contains('closeIngredientList')) {
        $('.selectProcess').val('Request')
        selectedProcess();
        IngredientListToggle();
    }
    else {

        if ($('.selectProcess').val() == "Request") {
            IngredientListToggle();
          
        }
        else {
            $('.selectProcess').val('Request')
            selectedProcess();

        }
        //else {
        //    $('.selectProcess').val('Request')
        //    selectedProcess();
        //}
  
    }
  
  
});
$('.stockInBtn').click(function () {

    let wrapper = document.querySelector('.ingredient-list-wrapper');
    if (wrapper.classList.contains('closeIngredientList')) {
        $('.selectProcess').val('Stock In')
        selectedProcess();
        IngredientListToggle();
    }
    else {

        if ($('.selectProcess').val() == "Stock In") {
            IngredientListToggle();

        }
        else {
            $('.selectProcess').val('Stock In')
            selectedProcess();

        }
      
       
       
      
    }
   
});
$('.stockOutBtn').click(function () {

    let wrapper = document.querySelector('.ingredient-list-wrapper');
    if (wrapper.classList.contains('closeIngredientList')) {
        $('.selectProcess').val('Stock Out')
        selectedProcess();
        IngredientListToggle();
    }
    else {
        if ($('.selectProcess').val() == "Stock Out") {
            IngredientListToggle();

        }
        else {
            $('.selectProcess').val('Stock Out')
            selectedProcess();

        }
      
       
    }
});



$('.exitIngredientList').click(function () {
   
    IngredientListToggle();
})

AddIngredientList();
function AddIngredientList() {
    let tableBody = document.querySelector('.inventory-table tbody');

    tableBody.addEventListener('click', function (event) {
        let row = event.target.closest('tr');
        if (row && event.target.tagName !== 'BUTTON') {

            let ingredient = ingredientList.find(item => item.ingredientId == row.dataset.id)
            if (ingredient) {
              
                popUpMessageInvenotryTop('Ingredient is already in the list', 'info', 365)
            }
            else {
               

                popUpMessageInvenotryTop('Added in the list', 'success', 260)
                ingredientList.push({
                    ingredientId: Number(row.dataset.id),
                    ingredientName: row.dataset.name,
                    ingredientQty: 1

                });

                DisplayIngredientList();
            }
         
            console.log(ingredientList);
        }
    });

}


function DisplayIngredientList() {

    const tableBody = document.querySelector('.ingredient-list-table tbody');
    let html = '';
    ingredientList.forEach((item) => {

        const truncatedName = item.ingredientName.length > 10 ? `${item.ingredientName.substring(0, 10)}...` : item.ingredientName;
        html +=
            `
             <tr >
                    <td>
                            <img src="/images/delete-black.png" class="delete-ingredient-img d-block mx-auto" onclick="deleteItemIngredient(${item.ingredientId})"/>
                    </td>
                    <td class="table-data-name">
                        ${truncatedName}
                    </td>
                    <td class="table-data-quantity">
                        <div class="quantity-table-data">
                            
                            <input data-id="${item.ingredientId}" maxlength="6" onchange="qtyChange(this)" class="quantityInput" oninput="validateQuantity(this)" value="${item.ingredientQty}" />
                          

                        </div>

                    </td>

                   
                </tr>
                                 
            `
    });

    tableBody.innerHTML = html;

   
}

function qtyChange(input) {
    let idIngredient = Number(input.dataset.id);
    const ingredient = ingredientList.find((item) => item.ingredientId === idIngredient);
    const inputValue = input.value.trim();

   
    if (!inputValue || inputValue == 0) {
        input.value = 1;
    }
    ingredient.ingredientQty = Number(input.value);
  
}


function validateQuantity(input) {

    input.value = input.value.replace(/[^0-9]/g, '');
   
}



function deleteItemIngredient(id) {
    let indexIngrediet = ingredientList.findIndex(item => item.ingredientId === id);

    if (indexIngrediet !== -1) {
        ingredientList.splice(indexIngrediet, 1);
        DisplayIngredientList();

        console.log(ingredientList)
    }
}

$('.processIngredientListBtn').click(function () {
  
    
    ProcessDetails();

});

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

//Set Process Details Modal Default Values
function ProcessDetails() {
    if (ingredientList.length == 0) {

        popUpMessageInvenotryTop('List is empty', 'error', 260)
       
    }
    else {

        let selectedProcess = document.querySelector('.selectProcess');
        let selectedVal = selectedProcess.value;


        $('#processDetailsModal .modal-title').text(selectedVal.toUpperCase());


        let tableBody = document.querySelector('.process-detail-table tbody');
        let html = ``;

        ingredientList.forEach(item => {
            html += `          
                      <tr >                  
                            <td class="table-data-name">
                                ${item.ingredientName}
                            </td>
                            <td class="table-data-quantity">
                                ${item.ingredientQty}
                            </td>                   
                       </tr>       
                    `
        });

        tableBody.innerHTML = html;

        $('#processDetailsModal').modal('show');
    }  
}


//when the submit button is click
$('.processSubmit').click(function () {

    //create an array to store the insufficient ingredients
    const insufficientList = []
    if ($('.selectProcess').val() == "Stock Out") {
        let ingredient = ingredientListQuanti

        //check every ingredients if they are greater than or equal to the stock out quantity
        //if every iteration is true the result is true
        let result = ingredientList.every(item => {
            let findIngredient = ingredient.find(s => s.ingredientId == item.ingredientId);         
            return findIngredient.quantity >= item.ingredientQty

        });

        //iterate the ingredients list and add the ingredients to the array if it is insufficient
        ingredientList.forEach(item => {
            let findIngredient = ingredient.find(s => s.ingredientId == item.ingredientId);
            if (!(findIngredient.quantity >= item.ingredientQty)) {
                insufficientList.push(item.ingredientName)
            }
        });

        //check if the result
        if (result) {
            //submit if the result is true
            let jsonData = JSON.stringify(ingredientList);

            $('.listData').val(jsonData);

            $('#formProcess').submit();
        }
        else {
            //show a pop up message if some ingredients are insufficient
            let insufficientListText = insufficientList.map(item => `<li>${item}</li>`).join('');
           
            Swal.fire({
                icon: "error",
                title: "Insufficient Quantity <br>",
                html: `
                   <ul class="swal-stockOutInsufficient-html">${insufficientListText}</ul>`,
                showConfirmButton: false,
                timer: 2000,
                padding: "1em",
                customClass: {
                    icon: 'custom-icon',
                    title: 'swal-stockOutInsufficient-title',
                   

                }

            })
          
        }

    }
    else {
        let jsonData = JSON.stringify(ingredientList);

        $('.listData').val(jsonData);

        $('#formProcess').submit();
    }
    
})

//call the function when the select process value changed
$('.selectProcess').change(function () {
    selectedProcess();
   
});
//shows the remarks when the selected process is stock out
function selectedProcess() {
    if ($('.selectProcess').val() == "Stock Out") {

        $('.select-remarks-wrapper').show();
    }
    else {

        $('.select-remarks-wrapper').hide();
    }

}

       

