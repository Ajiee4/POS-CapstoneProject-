//Setup the table
$(document).ready(function () {
    $('.product-table').DataTable({
        "paging": true,       
        "searching": true,
        "ordering": false,
        "pageLength": 5
    });

    $('.updateProductBtn').tooltip({
        title: function () {
            return $(this).attr('data-tooltip');
        }
    });

    $('[data-toggle="tooltip"]').tooltip();

    $('.loader-wrapper').hide();
    $('.product-wrapper').css({
        "visibility": "visible"
    });
});




////pop up message using sweetalert
function popUpMessageProduct(message, icon) {
    Swal.fire({
        text: message,
        icon: icon,
        showConfirmButton: false,
        timer: 2000,
    });
}


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


//when the archive button is click, the form will be submitted
$('.archiveBtn').click(function () {

    Swal.fire({
       
        title: "Are you sure you want to archive this product? <br/>",
        icon: "question",    
        iconColor: "#938F8F", 
        showCancelButton: true,
        confirmButtonColor: "#006ACD",
        cancelButtonColor: "#F71900",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'general-swal-icon',
            title: 'general-swal-title swal-archive-product-title',
            confirmButton: 'general-swal-confirm-btn',
            cancelButton: 'general-swal-cancel-btn'
           
        }

    }).then((result) => {

        if (result.isConfirmed) {

            $('.archiveForm').submit();

        }
    });
   
})
//when the unarchive button is click, the form will be submitted
$('.unarchiveBtn').click(function () {

    Swal.fire({
        title: "Are you sure you want to unarchive this product? <br/>",    
        icon: "question",
        iconColor: "#938F8F",
        showCancelButton: true,
        confirmButtonColor: "#006ACD",
        cancelButtonColor: "#F71900",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'general-swal-icon',
            title: 'general-swal-title swal-unarchive-product-title',
            confirmButton: 'general-swal-confirm-btn',
            cancelButton: 'general-swal-cancel-btn'

        }

    }).then((result) => {

        if (result.isConfirmed) {

            $('.unarchiveForm').submit();

        }
    });
   
})

//when update button is click, set default value inside the update produtct modal
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

//validate the price input
function validatePrice(input) {

    let value = input.value;

    let validValue = value.match(/^\d*\.?\d{0,2}$/);

    if (validValue) {
        input.value = validValue[0];
    }
    else {
       
        popUpMessageProduct("Invalid input","error")
        input.value = "";
    }
}

//call the function when submit button is click
$('.addProductSubmit').click(function () {

    if ($('.selectCat option').length == 0) {
        popUpMessageProduct("Create new category first", "error")
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

        popUpMessageProduct("Fill out all necessary information", "error");       
    }
    else {

        if (productName.length >= 3 && productName.length <= 15) {
        
            $('.addProductInputName').val(productName);
            Swal.fire({
                icon: "question",
                title: "Do you want to add this product?",              
                icon: "question",
                iconColor: "#938F8F",
                showCancelButton: true,
                confirmButtonColor: "#006ACD",
                cancelButtonColor: "#F71900",
                confirmButtonText: "Yes",
                customClass: {
                    icon: 'general-swal-icon',
                    title: 'general-swal-title',
                    confirmButton: 'general-swal-confirm-btn',
                    cancelButton: 'general-swal-cancel-btn'

                }

            }).then((result) => {

                if (result.isConfirmed) {

                    $("#addProductForm").submit();

                }
            });


        } else {

            popUpMessageProduct("Input must be 3-15 characters for product name", "error");
           
        }
    }

}

//when update product submit is click
$('.updateProductSubmit').click(function () {
    if ($('.selectCat option').length == 0) {
        popUpMessageProduct("Create new category first", "error")
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

        popUpMessageProduct("Fill out all necessary information", "error");

    }
    else {

        if (productName.length >= 3 && productName.length <= 15) {
            $('.updateProductInputName').val(productName);
            Swal.fire({
                icon: "question",
                title: "Do you want to update this product?",
                iconColor: "#938F8F",
                showCancelButton: true,
                confirmButtonColor: "#006ACD",
                cancelButtonColor: "#F71900",
                confirmButtonText: "Yes",
                customClass: {
                    icon: 'general-swal-icon',
                    title: 'general-swal-title',
                    confirmButton: 'general-swal-confirm-btn',
                    cancelButton: 'general-swal-cancel-btn'

                }

            }).then((result) => {

                if (result.isConfirmed) {

                    $("#updateProductForm").submit();

                }
            });
          
        } else {

            popUpMessageProduct("Input must be 3-15 characters for product name", "error");

        }
    }

}
