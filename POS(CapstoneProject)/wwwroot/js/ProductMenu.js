//Initialize data table
$(document).ready(function () {
    $('.product-table').DataTable({
        "paging": true,
        "scrollY": true,
        "searching": true,
        "ordering": true,
        "pageLength": 5

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
    $('#addProductModal .productInputName').val('');
    $('#addProductModal .productInputPrice').val('');
    $('#addProductModal .photo-wrapper img').attr('src', '/images/noimage.jpg');
    $('#addProductModal .inputPhoto').val('');
});
//$('#addProductBtn').click(function () {
//    $('.photo-wrapper img').attr('src', '/images/noimage.jpg');
//});


//when the archive button is click, the form will be submitted
$('.archiveBtn').click(function () {

    $('.archiveForm').submit();
})
//when the unarchive button is click, the form will be submitted
$('.unarchiveBtn').click(function () {

    $('.unarchiveForm').submit();
})

//when update button is click
function updateProduct(id, name, price, category, img) {

    alert(id)
    $('#updateProductModal .productId').val(id); 
    $('#updateProductModal .productInputName').val(name);
    $('#updateProductModal .productInputPrice').val(price);
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