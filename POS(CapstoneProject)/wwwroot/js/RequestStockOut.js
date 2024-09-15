// for request  and stock out
let RequestList = [];


function displayModal(name) {
    const stockOutWrapper = document.querySelector('.stock-out-wrapper');
    const requestListWrapper = document.querySelector('.request-list-wrapper');
    const inventorywrapper = document.querySelector('.inventory-wrapper');
    if (name === 'Request') {
        requestListWrapper.style.visibility = requestListWrapper.style.visibility === 'hidden' ? 'visible' : 'hidden';
        if (stockOutWrapper.style.visibility === 'visible') {
            stockOutWrapper.style.visibility = 'hidden';
        }
        if (requestListWrapper.style.visibility === 'visible') {
            requestListWrapper.style.opacity = 0;
            requestListWrapper.style.transform = 'translateY(-20px)';
            requestListWrapper.style.transition = 'all 0.3s ease-in-out';
            setTimeout(() => {
                requestListWrapper.style.opacity = 1;
                requestListWrapper.style.transform = 'translateY(0)';
            }, 10);
            // Adjust the width of the inventory table
            inventorywrapper.style.width = 'calc(100% - 630px)';
            inventorywrapper.style.transition = 'all 0.5s ease-in-out';
        } else {
            requestListWrapper.style.opacity = 1;
            requestListWrapper.style.transform = 'translateY(0)';
            requestListWrapper.style.transition = 'all 0.3s ease-in-out';
            setTimeout(() => {
                requestListWrapper.style.opacity = 0;
                requestListWrapper.style.transform = 'translateY(-20px)';
            }, 10);
            // Reset the width of the inventory table
            inventorywrapper.style.width = '100%';
            inventorywrapper.style.transition = 'all 0.5s ease-in-out';

        }
    }
    else if (name === 'StockOut') {
        stockOutWrapper.style.visibility = stockOutWrapper.style.visibility === 'hidden' ? 'visible' : 'hidden';
        if (requestListWrapper.style.visibility === 'visible') {
            requestListWrapper.style.visibility = 'hidden';
        }
        if (stockOutWrapper.style.visibility === 'visible') {
            stockOutWrapper.style.opacity = 0;
            stockOutWrapper.style.transform = 'translateY(-20px)';
            stockOutWrapper.style.transition = 'all 0.3s ease-in-out';
            setTimeout(() => {
                stockOutWrapper.style.opacity = 1;
                stockOutWrapper.style.transform = 'translateY(0)';
            }, 10);
            // Adjust the width of the inventory table
            inventorywrapper.style.width = 'calc(100% - 630px)';
        } else {
            stockOutWrapper.style.opacity = 1;
            stockOutWrapper.style.transform = 'translateY(0)';
            stockOutWrapper.style.transition = 'all 0.2s ease-in-out';
            setTimeout(() => {
                stockOutWrapper.style.opacity = 0;
                stockOutWrapper.style.transform = 'translateY(-20px)';
            }, 10);
            // Reset the width of the inventory table
            inventorywrapper.style.width = '100%';
            inventorywrapper.style.transition = 'all 0.5s ease-in-out';

        }
    }
}

function DisplayRequest() {
    const tableBody = document.querySelector('.styled-table tbody');
    let html = '';
    const storedList = localStorage.getItem('RequestList');
    const RequestList = JSON.parse(storedList); // Parse the stored list

    if (RequestList === null) {
        html +=
            `
             <tr >
                    <td class="table-data-quantity text-center"> Please Click the Desired Ingredients to be Requested</td>
                </tr> 
                                 
            `
    } else {
        RequestList.forEach((item) => {
            const truncatedName = item.ingredientName.length > 10 ? `${item.ingredientName.substring(0, 10)}...` : item.ingredientName;
            html +=
                `
                 <tr >
                        <td style="padding: 10px">
                                <img src="/images/delete-black.png" class="delete-checkout-img d-block mx-auto" onclick="deleteItem(${item.ingredientId})"/>
                        </td>
                        <td class="table-data-name">
                            ${truncatedName}
                        </td>
                        <td class="table-data-quantity"> 
                            <input id="ingQuantity" data-prod-id="${item.ingredientId}" value="${item.ingredientQty}"/> 
                            &nbsp;
                        </td>
                    </tr> 
                                 
                `
        });
    }

    tableBody.innerHTML = html;

    // Add event listener to input fields to save quantity to localStorage
    $('input[id="ingQuantity"]').on('keypress', function (event) {
        if (event.which !== 8 && isNaN(String.fromCharCode(event.which))) {
            event.preventDefault();
        }
    });

    $('input[id="ingQuantity"]').on('change', function () {
        if ($(this).val() === null || $(this).val() === '') {
            $(this).val('0');
        }
        const ingredientId = $(this).data('prod-id');
        const newQuantity = parseInt($(this).val());
        const storedList = localStorage.getItem('RequestList');
        const RequestList = JSON.parse(storedList);

        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            width: 300,
            showConfirmButton: false,
            timer: 1500,
        });
        const index = RequestList.findIndex(item => item.ingredientId === ingredientId);
        if (index !== -1) {
            RequestList[index].ingredientQty = newQuantity;
            console.log(RequestList)
            console.log(newQuantity)
            console.log(index)
            Toast.fire({
                icon: "success",
                title: "Product Quantity Updated"

            });

            localStorage.setItem('RequestList', JSON.stringify(RequestList));
        }
    });
}
$('.requestSubmit').click( function () {
    Swal.fire({
        icon: "question",
        title: "Confirm Request? <br>",

        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'Confirm',

        }

    }).then((result) => {

        if (result.isConfirmed) {
            let jsonData = localStorage.getItem('RequestList');
            console.log(jsonData);
            $('.requestInput').val(jsonData);
          

            $('#requestForm').submit();

            RequestList.splice(0);
            localStorage.setItem('RequestList', JSON.stringify(RequestList));

        }
    });
 
   
});
function deleteItem(id) {
    // Implement the logic to delete the item from the RequestList and update the UI
    const index = RequestList.findIndex(item => item.ingredientId === id);
    if (index !== -1) {
        RequestList.splice(index, 1);
        localStorage.setItem('RequestList', JSON.stringify(RequestList));
        DisplayRequest(); // Update the UI
    }
}
function requestitem(id, name, quantity) {

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        width: 300,
        showConfirmButton: false,
        timer: 1500,
    });
    const requestListWrapper = document.querySelector('.request-list-wrapper');
    const stockOutWrapper = document.querySelector('.stock-out-wrapper');

    // Check if the wrapper is visible before adding to local storage
    if (requestListWrapper.style.visibility === 'visible' || stockOutWrapper.style.visibility === 'visible') {
        let product = RequestList.find(item => item.ingredientId === id);

        if (product) {

            product.ingredientQty += quantity;
            Toast.fire({
                icon: "success",
                title: "Ingredient Quantity Updated"
            });
        } else {

            Toast.fire({
                icon: "success",
                title: "Product Added"
            });

            RequestList.push({
                ingredientId: id,
                ingredientName: name,
                ingredientQty: quantity
            });

            // Add the item to the request list
            const row = document.querySelector(`tr[data-id="${id}"]`);
            console.log(id);
        }

        // Add to local storage only if the wrapper is visible
        localStorage.setItem('RequestList', JSON.stringify(RequestList));
    }

    DisplayRequest();
    console.log(RequestList);
}

window.addEventListener('load', () => {
    const storedList = localStorage.getItem('RequestList');
    if (storedList) {
        RequestList = JSON.parse(storedList);
        DisplayRequest();
    }
});

const cancelButton = document.querySelector('.cancelrequest');

cancelButton.addEventListener('click', () => {
    localStorage.clear();
    //reset the RequestList array 
    RequestList = [];
    document.querySelector('.request-list-wrapper table tbody').innerHTML = '';
    document.querySelector('.stock-out-wrapper table tbody').innerHTML = '';
});

