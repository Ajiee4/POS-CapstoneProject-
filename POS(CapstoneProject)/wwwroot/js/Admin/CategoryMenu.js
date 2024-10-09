//Setting up the Data Table
$(document).ready(function () {
    $('.category-table').DataTable({
        "paging": true,
        "searching": true,
        "ordering": false,
        "pageLength": 5,

    });

    $('.loader-wrapper').hide();

    $('.category-wrapper').css({
        "visibility": "visible"
    });

    $('.updateCategoryBtn').tooltip({
        title: function () {
            return $(this).attr('data-tooltip');
        }
    });

    $('[data-toggle="tooltip"]').tooltip();
});

//call the function with add category button is click
$('.addSubmitBtn').click(function () {
    AddCategory();
});

function validateCategoryName(input) {
    
    let inputValue = input.value;

    inputValue = inputValue.replace(/[^a-zA-Z ]+/g, '');
    inputValue = inputValue.replace(/\s+/g, ' ');
    inputValue = inputValue.trimStart();
    input.value = inputValue;
}

function archiveCategory(id) {

    popUpMessageChoice("Are you sure you want to archive this category? <br/>", '', 'question', 'general-swal-icon', 'general-swal-title swal-archive-category-title', () => {
        $('.archiveInputCategory').val(id);
        $('.archiveCategoryForm').submit();
    });


}
/*unArchive Product*/
function unArchiveCategory(id) {

   
    popUpMessageChoice("Are you sure you want to unarchive this category? <br/>", '', 'question', 'general-swal-icon', 'general-swal-title swal-unarchive-category-title', () => {
        $('.unarchiveInputCategory').val(id);
        $('.unarchiveCategoryForm').submit();
    });
}



//function for validating the input category
function AddCategory() {
    let categoryName = document.querySelector('.addInputName').value.trim();

    if (categoryName == '') {

        popUpMessage("Please input a category name", "error");
    }
    else {

        if (categoryName.length >= 3 && categoryName.length <= 15) {

            popUpMessageChoice("Are you sure you want to add this category?",'', 'question', 'general-swal-icon','general-swal-title', () => { $("#addCategoryForm").submit() });

        } else {
            popUpMessage("Input must be 3-15 characters", "error");
            
        }
    }
    
}




function UpdateCategory() {
    let categoryName = document.querySelector('.updateInputName').value.trim();

    if (categoryName == '') {

        popUpMessage("Please input a category name", "error");
    }
    else {
        if (categoryName.length >= 3 && categoryName.length <= 15) {

            popUpMessageChoice("Are you sure you want to update this category?", '', 'question', 'general-swal-icon', 'general-swal-title', () => { $("#updateCategoryForm").submit() });


        } else {

            popUpMessage("Input must be 3-15 characters", "error");

        }
    }
    
}

//reset to defaul value when closing the modal
$('.updateSubmitBtn').click(function () {

    UpdateCategory();

});
//clear inputs when modal is close
function resetAddModal() {
    $('#addCategoryModal').on('hidden.bs.modal', function () {
        // Clear input fields
        $('.addInputName').val('');
      
    });
}

resetAddModal();

//set the default value when modal shows
function updateCategory(id, name) {
  
    $('.updateInputName').val(name);
  
    $('.input-id').val(id);
  
}

function RowClick(url, row,event) {

    
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
        return;
    }
    if (event.target.classList.contains('archived-category') || event.target.closest('.archived-category')) {
        return;
    }
    var categoryName = row.querySelector('td[data-label="Category"]').textContent;

    localStorage.setItem('categoryName', categoryName);
    location.href = url;
  
}