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




//validate the category name
function validateCategoryName(input) {
    
    let inputValue = input.value;

    if (inputValue.match(/[^a-zA-Z ]+/g)) {
        popUpMessageToast('error', 'Only letters are allowed', 305)
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


//archive the category
function archiveCategory(id) {

    popUpMessageChoice("Are you sure you want to archive this category? <br/>", '', 'question', 'general-swal-icon', 'general-swal-title swal-archive-category-title', () => {
        $('.archiveInputCategory').val(id);
        $('.archiveCategoryForm').submit();
    });


}

//unarchive the category
function unArchiveCategory(id) {

    popUpMessageChoice("Are you sure you want to unarchive this category? <br/>", '', 'question', 'general-swal-icon', 'general-swal-title swal-unarchive-category-title', () => {
        $('.unarchiveInputCategory').val(id);
        $('.unarchiveCategoryForm').submit();
    });
}

//add new category function
function AddCategory() {
    let categoryName = document.querySelector('.addInputName').value.trim();

    if (categoryName == '') {

        popUpMessage("Please input a category name", "error");
    }
    else {

        popUpMessageChoice("Are you sure you want to add this category?", '', 'question', 'general-swal-icon', 'general-swal-title', () => { $("#addCategoryForm").submit() });
       
    } 
}

//update category function
function UpdateCategory() {
    let categoryName = document.querySelector('.updateInputName').value.trim();

    if (categoryName == '') {

        popUpMessage("Please input a category name", "error");
    }
    else {

        popUpMessageChoice("Are you sure you want to update this category?", '', 'question', 'general-swal-icon', 'general-swal-title', () => { $("#updateCategoryForm").submit() });       
    } 
}

//update category
$('.updateSubmitBtn').click(function () {

    UpdateCategory();

});

//add category
$('.addSubmitBtn').click(function () {
    AddCategory();
});

//clear inputs when add modal is close
function resetAddModal() {
    $('#addCategoryModal').on('hidden.bs.modal', function () {
        // Clear input fields
        $('.addInputName').val('');
      
    });
}

resetAddModal();

//set the default value when update modal shows
function updateCategory(id, name) {
  
    $('.updateInputName').val(name); 
    $('.input-id').val(id);
  
}


//redirect to the Sales Menu when clicking the row
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