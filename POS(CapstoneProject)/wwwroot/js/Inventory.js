//setting up the data table
$(document).ready(function () {
    $('.inventory-table').DataTable({
        "paging": true,

        "searching": true,
        "ordering": true,
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
function UpdateIngredient(id, name, measurement, threshold) {
  
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