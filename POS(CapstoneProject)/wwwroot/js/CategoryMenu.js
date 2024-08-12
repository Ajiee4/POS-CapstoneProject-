//Setting up the Data Table
$(document).ready(function () {
    $('.category-table').DataTable({
        "paging": true,
        "scrollY": true,
        "searching": true,
        "ordering": true,
        "pageLength": 5
       
    });
   
});

//reset to defaul value when closing the modal

function resetAddModal() {
    $('#addCategoryModal').on('hidden.bs.modal', function () {
        // Clear input fields
        $('.addInputName').val('');
        $('.addSelectCategory').val('Product'); // Set default value for select
    });
}

resetAddModal();


//function resetUpdateModal() {
//    $('#updateCategoryModal').on('hidden.bs.modal', function () {
//        // Clear input fields
//        $('.updateInputName').val('');
//        $('.addSelectCategory').val('Product'); // Set default value for select
//    });
//}
//update button was clicked
function updateCategory(id, name, type) {
  
    $('.updateInputName').val(name);
    $('.updateSelectCategory').val(type); 
    $('.input-id').val(id);
  
}



