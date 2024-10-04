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

//function for pop up messages
function popUpMessageCategory(message, icon) {
    Swal.fire({
        text: message,
        icon: icon,
        padding: "1em",
        showConfirmButton: false,
        timer: 2000
    });
}
//call the function with add category button is click
$('.addSubmitBtn').click(function () {
    AddCategory();
});


//function for validating the input category
function AddCategory() {
    let categoryName = document.querySelector('.addInputName').value.trim();

    if (categoryName == '') {

        popUpMessageCategory("Please input a category name", "error");
    }
    else {

        if (categoryName.length >= 3 && categoryName.length <= 15) {

            Swal.fire({
                icon: "question",
                title: "Do you want to add this category?",
                padding: "1em",
                showCancelButton: true,
                confirmButtonColor: "#1964C5",
                cancelButtonColor: "#F71F1F",
                confirmButtonText: "Yes",
                customClass: {
                    icon: 'custom-icon',
                    title: 'swal-addCategory-title',

                }

            }).then((result) => {

                if (result.isConfirmed) {

                    $("#addForm").submit();

                }
            });


        } else {
            popUpMessageCategory("Input must be 3-15 characters", "error");
            
        }
    }
    
}




function UpdateCategory() {
    let categoryName = document.querySelector('.updateInputName').value.trim();

    if (categoryName == '') {

        popUpMessageCategory("Please input a category name", "error");
    }
    else {
        if (categoryName.length >= 3 && categoryName.length <= 15) {

            Swal.fire({
                icon: "question",
                title: "Do you want to update this category?",
                padding: "1em",
                showCancelButton: true,
                confirmButtonColor: "#1964C5",
                cancelButtonColor: "#F71F1F",
                confirmButtonText: "Yes",
                customClass: {
                    icon: 'custom-icon',
                    title: 'swal-updateCategory-title',

                }

            }).then((result) => {

                if (result.isConfirmed) {

                    $("#updateForm").submit();

                }
            });


        } else {

            popUpMessageCategory("Input must be 3-15 characters", "error");

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

function RowClick(url, event) {

    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
        return;
    }

    location.href = url;

    var categoryName = event.querySelector('td[data-label="Category"]').textContent;
   
    localStorage.setItem('categoryName', categoryName);
    
}