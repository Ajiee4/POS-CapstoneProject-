﻿

//Setting up the Data Table

$('.category-table').DataTable({
    "paging": true,
    
    "searching": true,
    "ordering": true,
    "pageLength": 5,
   
       
       
});
   


//reset to defaul value when closing the modal

function resetAddModal() {
    $('#addCategoryModal').on('hidden.bs.modal', function () {
        // Clear input fields
        $('.addInputName').val('');
      
    });
}

resetAddModal();

//update button was clicked
function updateCategory(id, name) {
  
    $('.updateInputName').val(name);
  
    $('.input-id').val(id);
  
}

$('.submitFormBtn').click(function () {

})




   