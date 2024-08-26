﻿$(document).ready(function () {
    $('.inventory-table').DataTable({
        "paging": true,

        "searching": true,
        "ordering": true,
        "pageLength": 5,

    });
})
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
        input.value = value.replace(/[^\d\.]/g, ''); // remove non-numeric characters
    }
}

$('.addIngredientSubmit').click(function () {
    AddIngredient();
});

function AddIngredient() {
    let ingredientName = document.querySelector('#addIngredientModal .inputIngredientName').value;
    let unitMeasurement = document.querySelector('#addIngredientModal .inputMeasurement').value;
    let costPerUnit = document.querySelector('#addIngredientModal .inputCost').value;
    let lowStockThreshold = document.querySelector('#addIngredientModal .inputThreshold').value;

    if (ingredientName === '' || unitMeasurement === '' || costPerUnit === '' || lowStockThreshold === '') {
        popUpMessageInventory('Fill out all information', 'error');
        return;
    }
    if (!isValidName(ingredientName)) {
        popUpMessageInventory("Input ingredient name must be between 3 and 15 characters","error")
        return;
    }
    if (!isValidCost(costPerUnit)) {
        popUpMessageInventory("Input Cost Per Unit must be between 1 and 8 characters", "error")
        return;
    }
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

function isValidName(name) {

    if (name.length >= 3 && name.length <= 15) {
        return true;
    }
}
function isValidCost(cost) {

    if (cost.length >= 1 && cost.length <= 8) {
        return true;
    }
}

function UpdateIngredient(id, name, measurement, cost, threshold, expiry) {
  
    $('#updateIngredientModal .inputIngredientId').val(id),
    $('#updateIngredientModal .inputIngredientName').val(name),
    $('#updateIngredientModal .inputMeasurement').val(measurement),
    $('#updateIngredientModal .inputCost').val(cost),
    $('#updateIngredientModal .inputThreshold').val(threshold),
    $('#updateIngredientModal .inputExpiry').val(expiry)
        
}
$('.updateIngredientSubmit').click(function () {
    updateIngredient();
});

function updateIngredient() {
    let ingredientName = document.querySelector('#updateIngredientModal .inputIngredientName').value;
    let unitMeasurement = document.querySelector('#updateIngredientModal .inputMeasurement').value;
    let costPerUnit = document.querySelector('#updateIngredientModal .inputCost').value;
    let lowStockThreshold = document.querySelector('#updateIngredientModal .inputThreshold').value;

    if (ingredientName === '' || unitMeasurement === '' || costPerUnit === '' || lowStockThreshold === '') {
        popUpMessageInventory('Fill out all information', 'error');
        return;
    }
    if (!isValidName(ingredientName)) {
        popUpMessageInventory("Input ingredient name must be between 3 and 15 characters", "error")
        return;
    }
    if (!isValidCost(costPerUnit)) {
        popUpMessageInventory("Input Cost Per Unit must be between 1 and 8 characters", "error")
        return;
    }
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