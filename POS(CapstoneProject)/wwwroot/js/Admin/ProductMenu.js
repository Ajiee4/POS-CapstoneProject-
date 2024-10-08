
$(document).ready(function () {
    //Setup the table
    $('.product-table').DataTable({
        "paging": true,       
        "searching": true,
        "ordering": false,
        "pageLength": 5
    });

    //set up tooltip
    $('[data-toggle="tooltip"]').tooltip();

    //shows the tooltip
    $('.updateProductBtn').tooltip({
        title: function () {
            return $(this).attr('data-tooltip');
        }
    });
    
    //hides the loader and show the contens
    $('.loader-wrapper').hide();
    $('.product-wrapper').css({
        "visibility": "visible"
    });
});


//when the button is click it will fire the input to select an image
$('#addProductModal .uploadPhoto').click(function () {

    $('#addProductModal .inputPhoto').click();
});

//Showing the product photo inside the modal
$('#addProductModal .inputPhoto').change(function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        $('#addProductModal .photo-wrapper img').attr('src', e.target.result);
    };

    reader.readAsDataURL(file);
});

//when modal is close, it will clear the value
$('#addProductModal').on('hidden.bs.modal', function () {
    $('#addProductModal .addProductInputName').val('');
    $('#addProductModal .addProductInputPrice').val('');
    $('#addProductModal .photo-wrapper img').attr('src', '/images/noimage.jpg');
    $('#addProductModal .inputPhoto').val('');
});

/*Archive Product*/
function archiveProduct(element) {

    let productId = element.dataset.id;
    popUpMessageChoice("Are you sure you want to archive this product? <br/>", '', 'question', 'general-swal-icon', 'general-swal-title swal-archive-product-title', () => {
        $('.archiveInput').val(productId);
        $('.archiveForm').submit();
    });
    
    
}
/*unArchive Product*/
function unArchiveProduct(element) {

    let productId = element.dataset.id;
    popUpMessageChoice("Are you sure you want to unarchive this product? <br/>", '', 'question', 'general-swal-icon', 'general-swal-title swal-unarchive-product-title', () => {
        $('.unArchiveInput').val(productId);
        $('.unarchiveForm').submit();
    });
    
}
//set the defaul value inside the Update Modal
function updateProduct(id, name, price, category, img) {

    $('#updateProductModal .productId').val(id); 
    $('#updateProductModal .updateProductInputName').val(name.trim());
    $('#updateProductModal .updateProductInputPrice').val(price);
    $('#updateProductModal .selectProductCategory option[value="' + category + '"]').prop('selected', true);
  
    if (img) {
        const base64Image = 'data:image/jpeg;base64,' + img;
        $('#updateProductModal .photo-wrapper img').attr('src', base64Image);
    } else {
        // If there's no image, set a default placeholder image
        $('#updateProductModal .photo-wrapper img').attr('src', '/images/noimage.jpg');
    }
}
//clear the value of input photo when the update modal is hidden
$('#updateProductModal').on('hidden.bs.modal', function () {
   
    $('#updateProductModal .inputPhoto').val('');
});
//when the upload photo button is click it will fire the input photo to select an image file
$('#updateProductModal .uploadPhoto').click(function () {

    $('#updateProductModal .inputPhoto').click();
});

//Showing the product photo inside the modal
$('#updateProductModal .inputPhoto').change(function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        $('#updateProductModal .photo-wrapper img').attr('src', e.target.result);
    };

    reader.readAsDataURL(file);
});

//validate the product price
function validatePrice(input) {
   
  

   
    if (input.value.match(/[^0-9.]/g)) {
        popUpMessageToast('error', 'Only digits are allowed', 300)
    }
    input.value = input.value.replace(/[^0-9.]/g, '');
  
    let decimalParts = input.value.split('.');  
    if (decimalParts.length > 1) {
        if (decimalParts[1].length > 2) {
            popUpMessageToast('error', 'Only 2 decimal places are allowed', 380)
        }
        decimalParts[1] = decimalParts[1].substr(0, 2);
    }
 
    input.value = decimalParts.join('.');  
}
//validate the product name
function validateProductName(input) {
    let inputValue = input.value;
  
    if (inputValue.match(/[^a-zA-Z ]+/g)) {
        popUpMessageToast('error', 'Only letters are allowed', 260)
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


//call the function when submit button is click
$('.addProductSubmit').click(function () {

    if ($('.selectCat option').length == 0) {
        popUpMessage("Create new category first", "error")
    }
    else {
        AddProduct();
    }
  
});


//validation of added product and submission
function AddProduct() {
    let productName = document.querySelector('.addProductInputName').value.trim();
    let productPrice = document.querySelector('.addProductInputPrice').value.trim();
    productName = productName.replace(/\s{2,}/g, ' ');
    if (productName == '' || productPrice == '') {

        popUpMessage("Fill out all necessary information", "error");       
    }
    else {

        if (productName.length >= 3 && productName.length <= 15) {
         
            $('.addProductInputName').val(productName);

            popUpMessageChoice("Do you want to add this product?", '', 'question', 'general-swal-icon', 'general-swal-title', () => {$("#addProductForm").submit()});         

        } else {

            popUpMessage("Input must be 3-15 characters for product name", "error");
           
        }
    }

}

//when update product submit is click
$('.updateProductSubmit').click(function () {
    if ($('.selectCat option').length == 0) {
        popUpMessage("Create new category first", "error")
    }
    else {
        UpdateProduct();
    }
   
});
//validation of updated product and submission
function UpdateProduct() {
    let productName = document.querySelector('.updateProductInputName').value;
    let productPrice = document.querySelector('.updateProductInputPrice').value;
    productName = productName.replace(/\s{2,}/g, ' ');

    if (productName == '' || productPrice == '') {

        popUpMessage("Fill out all necessary information", "error");

    }
    else {

        if (productName.length >= 3 && productName.length <= 15) {
            $('.updateProductInputName').val(productName);

            popUpMessageChoice("Do you want to update this product?", '', 'question', 'general-swal-icon', 'general-swal-title', () => { $("#updateProductForm").submit() });  
           
                 
        } else {

            popUpMessage("Input must be 3-15 characters for product name", "error");

        }
    }

}
