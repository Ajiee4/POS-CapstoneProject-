//Initialize data table
$(document).ready(function () {
    $('.product-table').DataTable({
        "paging": true,
        
        "searching": true,
        "ordering": true,
        "pageLength": 5

    });

});

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
    //set the defaul value when modal is hidden
    $('#addProductModal .addProductInputName').val('');
    $('#addProductModal .addProductInputPrice').val('');
    $('#addProductModal .photo-wrapper img').attr('src', '/images/noimage.jpg');
    $('#addProductModal .inputPhoto').val('');
});


//when the archive button is click, the form will be submitted
$('.archiveBtn').click(function () {

    Swal.fire({
       
        title: "Are you sure you want to archive this product? <br/>",
        icon: "warning",
        padding: "1em",
        iconColor: "#F71F1F",
        showCancelButton: true,
        confirmButtonColor: "#1964C5",
        cancelButtonColor: "#F71F1F",
        confirmButtonText: "Yes",
        customClass: {
            icon:  'custom-icon',
            title: 'swal-archive-title',
           
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
        padding: "1em",
        icon: "question",
        iconColor: "#1964C5",
        showCancelButton: true,
        confirmButtonColor: "#1964C5",
        cancelButtonColor: "#F71F1F",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'swal-unarchive-title',

        }

    }).then((result) => {

        if (result.isConfirmed) {

            $('.unarchiveForm').submit();

        }
    });
   
})

//when update button is click, set default value
function updateProduct(id, name, price, category, img) {

    $('#updateProductModal .productId').val(id); 
    $('#updateProductModal .updateProductInputName').val(name);
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
$('#updateProductModal').on('hidden.bs.modal', function () {
   
    $('#updateProductModal .inputPhoto').val('');
});
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

function validatePrice(input) {

    let value = input.value;

    let validValue = value.match(/^\d*\.?\d{0,2}$/);

    if (validValue) {
        input.value = validValue[0];
    } else {
       
        popUpMessageProduct("Only numbers are allowed","error")
        input.value = "";
    }
}

$('.addProductSubmit').click(function () {
    
    AddProduct();
});
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
                padding: "1em",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
                customClass: {
                    icon: 'custom-icon',
                    title: 'swal-addProd-title',

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


$('.updateProductSubmit').click(function () {

    UpdateProduct();
});

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
                padding: "1em",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
                customClass: {
                    icon: 'custom-icon',
                    title: 'swal-updateProd-title',

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
