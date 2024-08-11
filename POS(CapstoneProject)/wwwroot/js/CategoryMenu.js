﻿//Setting up the Data Table
$(document).ready(function () {
    $('.category-table').DataTable({
        "paging": true,
        "scrollY": true,
        "searching": true,
        "ordering": true,
        "pageLength": 5
       
    });
   
});

function updateCategory(id, name, type) {
  
    $('#updateCategoryModal .input-name').val(name);
    $('.selectCategory').val(type); 
    $('.input-id').val(id);
  
}


