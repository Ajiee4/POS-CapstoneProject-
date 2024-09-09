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

//call the function when
$('.addIngredientSubmit').click(function () {
    AddIngredient();
});

function AddIngredient() {
    let ingredientName = document.querySelector('#addIngredientModal .inputIngredientName').value;
    let unitMeasurement = document.querySelector('#addIngredientModal .inputMeasurement').value;
   
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
    let ingredientName = document.querySelector('#updateIngredientModal .inputIngredientName').value;
    let unitMeasurement = document.querySelector('#updateIngredientModal .inputMeasurement').value;   
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

let ingredientId = 0;
$('.InOutBtn').click(function () {
    let id = $(this).data('id');
   
    ingredientId = id;
})

$('#stockInIngredientModal').on('hidden.bs.modal', function () {

 
    $('#stockInIngredientModal .inputQuantity').val('');
});
$('#stockOutIngredientModal').on('hidden.bs.modal', function () {


    $('#stockOutIngredientModal .inputQuantity').val('');
});
$('.stockInIngredientSubmit').click(function () {
   
    $('.inputIngredientId').val(ingredientId);
    
    let quantity = document.querySelector('#stockInIngredientModal .inputQuantity').value;
    if (quantity === '') {
        popUpMessageInventory('Fill out all information', 'error')
        $('#stockInIngredientModal .inputQuantity').focus()
        return;
    }

    Swal.fire({
        icon: "question",
        title: "Are you sure to proceed stocking in?",
        padding: "1em",
        showCancelButton: true,
        confirmButtonColor: "#1964C5",
        cancelButtonColor: "#F71F1F",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'swal-stockInIngredient-title',
        }
    }).then((result) => {
        if (result.isConfirmed) {

            $('#stockInIngredientForm').submit();

        }
    });
    
});

//stockout
$('.stockOutIngredientSubmit').click(function () {

    $('.inputIngredientId').val(ingredientId);

    let quantity = document.querySelector('#stockOutIngredientModal .inputQuantity').value;
    if (quantity === '') {
        popUpMessageInventory('Fill out all information', 'error')
        $('#stockOutIngredientModal .inputQuantity').focus()
        return;
    }

    Swal.fire({
        icon: "question",
        title: "Are you sure to proceed stocking out?",
        padding: "1em",
        showCancelButton: true,
        confirmButtonColor: "#1964C5",
        cancelButtonColor: "#F71F1F",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'swal-stockOutIngredient-title',
        }
    }).then((result) => {
        if (result.isConfirmed) {

            $('#stockOutIngredientForm').submit();

        }
    });

});
function RequestToggle() {
    $('.request-wrapper').slideToggle(1000, function () {


        const requestWrapper = $('.request-wrapper');
        requestWrapper.toggleClass('closeRequest');

        if (requestWrapper.hasClass('closeRequest')) {
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


$('.requestIngredientBtn').click(function () {

   
   
    RequestToggle();
  
});


$('.exitRequest').click(function () {
   
    RequestToggle();
})

RequestIngredient();
function RequestIngredient() {
    let tableBody = document.querySelector('.inventory-table tbody');

    tableBody.addEventListener('click', function (event) {
        let row = event.target.closest('tr');
        if (row && event.target.tagName !== 'BUTTON') {

            let ingredient = ingredientList.find(item => item.ingredientId == row.dataset.id)
            if (ingredient) {
                popUpMessageInventory("Ingredient is already in the list", "error")
                //ingredient.ingredientQty++;
                //DisplayRequest();
            }
            else {
                ingredientList.push({
                    ingredientId: Number(row.dataset.id),
                    ingredientName: row.dataset.name,
                    ingredientQty: 1

                });

                DisplayRequest();
            }
         
            console.log(ingredientList);
        }
    });

}


function DisplayRequest() {

    const tableBody = document.querySelector('.request-table tbody');
    let html = '';
    ingredientList.forEach((item) => {

        const truncatedName = item.ingredientName.length > 10 ? `${item.ingredientName.substring(0, 10)}...` : item.ingredientName;
        html +=
            `
             <tr >
                    <td>
                            <img src="/images/delete-black.png" class="delete-request-img d-block mx-auto" onclick="deleteItemRequest(${item.ingredientId})"/>
                    </td>
                    <td class="table-data-name">
                        ${truncatedName}
                    </td>
                    <td class="table-data-quantity">
                        <div class="quantity-table-data">
                            
                            <input data-id="${item.ingredientId}" onchange="qtyChange(this)" class="quantityInput" oninput="validateQuantity(this)" value="${item.ingredientQty}" />
                          

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
    if (!inputValue) {
        input.value = 1;
    }
    ingredient.ingredientQty = Number(input.value);
    console.log(ingredientList);  
      
}


function validateQuantity(input) {

    input.value = input.value.replace(/[^0-9]/g, '');
   
}



function deleteItemRequest(id) {
    let indexIngrediet = ingredientList.findIndex(item => item.ingredientId === id);

    if (indexIngrediet !== -1) {
        ingredientList.splice(indexIngrediet, 1);
        DisplayRequest();

        console.log(ingredientList)
    }
}

$('.requestBtn').click(function () {
    Swal.fire({
        icon: "question",
        title: "Confirm Request?",

        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'swal-inventory-title',

        }

    }).then((result) => {

        if (result.isConfirmed) {
            let jsonData = JSON.stringify(ingredientList);
          
            $('.requestData').val(jsonData);

            $('#formRequest').submit();       

        }
    });
});

