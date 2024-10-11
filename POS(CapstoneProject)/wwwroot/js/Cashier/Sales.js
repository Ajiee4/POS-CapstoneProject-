
//array of objects
let checkOutListCashier = [];


$(document).ready(function () {

    $('[data-toggle="tooltip"]').tooltip();

    $('.loader-wrapper').hide();

    $('.product-list-wrapper').css({
        "visibility": "visible"
    });
  
 
});







//get the data from the locale storage and store it in the checkoutlist array
window.addEventListener('load', () => {
    const storedList = localStorage.getItem('checkoutListCashier');
    if (storedList) {
        checkOutListCashier = JSON.parse(storedList);
        DisplayCheckOut();
        cartCount();
    }
});


function cartCount() {
    let sum = 0;
    checkOutListCashier.forEach((item) => {
        sum += item.prodQty
    });
    $('.cart-count').text(sum);

}


let selectedCategory = 'All';
let searchQuery = '';

//filter out products based on the category
function FilterProduct(category) {
    selectedCategory = category;
    updateProductList();


    $('.category-item').removeClass('active');
    $(event.target).addClass('active');


}

//search product
function searchProduct() {
    searchQuery = document.querySelector('.searchProductInput').value.toLowerCase();
    updateProductList();
}
//function for displaying the products base on its category ang search input
function updateProductList() {
    const products = document.querySelectorAll('.product-item');
    let found = false;

    products.forEach(product => {
        const productName = product.querySelector('.product-item-name span').textContent.toLowerCase();
        const productCategory = product.getAttribute('data-category');


        const matchesCategory = (selectedCategory === 'All' || productCategory === selectedCategory);
        const matchesSearch = productName.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
            product.style.display = 'block';
            found = true;
        } else {
            product.style.display = 'none';
        }
    });


    document.querySelector('.noResult').style.display = found ? 'none' : 'block';
}
//display the check out items from the 
function DisplayCheckOut() {

    const tableBody = document.querySelector('.checkout-table tbody');
    let html = '';

    checkOutListCashier.forEach((item) => {

        const truncatedName = item.prodName.length > 5 ? `${item.prodName.substring(0, 6)}...` : item.prodName;
        html +=
            `
             <tr >
                    <td style="padding: 10px">
                            <img src="/images/delete.png"                         
                            class="delete-checkout-img"
                            onclick="deleteItemCheckOut(${item.prodID})"/>
                    </td>
                    <td class="table-data-name">
                        ${truncatedName}
                    </td>
                    <td class="table-data-quantity">
                        <div class="quantity-table-data">
                            <span class="button decrementBtn" onclick="decrementQty(${item.prodID})">
                                <img src="/images/minus.png" />
                            </span>

                            <span class="quantity">${item.prodQty}</span>

                            <span class="button incrementBtn" onclick="incrementQty(${item.prodID})">
                                <img src="/images/plus-white.png" />
                           </span>
                        </div>

                    </td>
                     <td class="table-data-coffee">
                       <input type="checkbox"/>
                    </td>

                    <td class="table-data-price">₱${item.prodPrice} &nbsp;</td>
                </tr>
                                 
            `
    });

    tableBody.innerHTML = html;

    let subTotalText = document.querySelector('.subTotalValue');
    let totalAmountText = document.querySelector('.TotalAmount');

    subTotalText.innerHTML = `₱${CalculateSubtotal().toFixed(2)}`;
    totalAmountText.innerHTML = `₱${CalculateTotalAmount().toFixed(2)}`;

}

//add the clicked product to the checklist
//call the display funct to show in the checklist
function checkoutProduct(id, name, quantity, price) {

    let product = checkOutListCashier.find(item => item.prodID === id);

    if (product) {

        product.prodQty += quantity;

        popUpMessageToast('success', 'Quantity Updated', 265);

    } else {

        checkOutListCashier.push({
            prodID: id,
            prodName: name,
            prodQty: quantity,
            prodPrice: price
        });

        popUpMessageToast('success', 'Product Added', 250);

    }

    localStorage.setItem('checkoutListCashier', JSON.stringify(checkOutListCashier));
    DisplayCheckOut();
    cartCount();

}


function deleteItemCheckOut(prodid) {


    let indexItem = checkOutListCashier.findIndex(item => item.prodID === prodid);

    checkOutListCashier.splice(indexItem, 1);

    DisplayCheckOut();
    cartCount();
    popUpMessageToast("success", "Product Deleted", 250);

    localStorage.setItem('checkoutListCashier', JSON.stringify(checkOutListCashier));

}

//increment the quantity of product
function incrementQty(id) {
    const product = checkOutListCashier.find((item) => item.prodID === id);
    if (product) {
        product.prodQty += 1;
        DisplayCheckOut();
        cartCount();
    }

    localStorage.setItem('checkoutListCashier', JSON.stringify(checkOutListCashier));
}

//decrement the quantity of product
function decrementQty(id) {
    const product = checkOutListCashier.find((item) => item.prodID === id);
    if (product && product.prodQty > 1) {
        product.prodQty -= 1;
        DisplayCheckOut();
        cartCount();

    }

    localStorage.setItem('checkoutListCashier', JSON.stringify(checkOutListCashier));
}
//delete a specific item from the checklist



//discount not yet applied; subtotal
function CalculateSubtotal() {
    let subtotal = 0;
    checkOutListCashier.forEach((item) => {
        subtotal += (item.prodPrice * item.prodQty);
    })
    subtotal = Math.round(subtotal * 100) / 100;
    return subtotal;

};

//calculate total amount
function CalculateTotalAmount() {
    let subTotal = CalculateSubtotal();
    let discount = $('#inputDiscount').val();
    let discountAmount = subTotal * (discount / 100);
    let totalAmount = subTotal - discountAmount;

    totalAmount = Math.round(totalAmount * 100) / 100;

    return totalAmount;
}
//adjust the total when the discount input changed
function ApplyDiscount(input) {

    const inputValue = input.value.trim();
    if (!inputValue) {
        input.value = 0;
    }

}

//only number can be entered in the discount input
function validateInput(input) {

    input.value = input.value.replace(/[^0-9]/g, '');
    let totalAmountText = document.querySelector('.TotalAmount');

    CalculateTotalAmount();
    totalAmountText.innerHTML = `₱${CalculateTotalAmount().toFixed(2)}`;

}

//cancel order
$('.cancelBtn').click(function () {

    if (checkOutListCashier.length == 0) {
        popUpMessageToast('error', 'Check Out List Empty', 290)

    }
    else {
        checkOutListCashier.splice(0);

        DisplayCheckOut();
        cartCount();
        popUpMessageToast('success', 'Check Out Canceled', 280);

        localStorage.setItem('checkoutListCashier', JSON.stringify(checkOutListCashier));

    }
})


$('.payBtn').click(function () {

    if (checkOutListCashier.length === 0) {
        popUpMessage("Check Out List Empty", "error");

    } else {
        $('#paymentModal').modal('toggle')
        let total = CalculateTotalAmount();
        $('.totalAmountInputReadOnly').val(total.toFixed(2))

    }
});

//cash is input
function onInputCash(input) {
    if (input.value.match(/[^0-9.]/g)) {
        popUpMessageToast('error', 'Only digits are allowed', 300)
    }
    input.value = input.value.replace(/[^0-9.]/g, '');

    let decimalParts = input.value.split('.');
    if (decimalParts.length > 1) {
        if (decimalParts[1].length > 2) {
            popUpMessageToast('error', 'Only 2 decimal places are allowed', 380)
        }
        decimalParts[1] = decimalParts[1].substr(0, 2);
    }

    input.value = decimalParts.join('.');

    if (input.value == '') {
        $('.changeAmountText').val(null);
        return;
    }

    $('.changeAmountText').val(null);


    let totalAmo = CalculateTotalAmount();
    let money = Number(input.value);


    if (money >= totalAmo) {
        let changeAmount = money - totalAmo;

        $('.changeAmountText').val(changeAmount.toFixed(2));

        $('#paymentModal .calculate-wrapper').css({
            "display": "block",
            "margin": "0px auto"
        })

    } else {
        $('#paymentModal .calculate-wrapper').css({
            "display": "none",
        })

        $('.changeAmountText').val('Insufficient Amount');

    }

}

$('#paymentModal').on('hidden.bs.modal', function () {
    $('.amountInput').val(null);
    $('.changeAmountText').val(null);
    $('.calculate-wrapper').hide();
});

/*validates the cash tendered*/

$('.calculateBtn').click(function () {

    popUpMessageChoice("Confirm payment? <br>", '', 'question', 'general-swal-icon ', 'general-swal-title swal-sales-title', () => {

        let total = CalculateTotalAmount();
        let jsonData = JSON.stringify(checkOutListCashier);
        let subTotal = Number(CalculateSubtotal());
        let cash = Number($('.amountInput').val());
        let changedue = Number($('.changeAmountText').val())
        let discount = Number($('#inputDiscount').val())

        let discountAmount = subTotal * (discount / 100);

        $('#checkOutTotalInput').val(total)
        $('#checkOutListInput').val(jsonData);
        $('#totalString').val(total.toFixed(2))
        $('#cashTendered').val(cash.toFixed(2))
        $('#changeDueAmount').val(changedue.toFixed(2));
        $('#subTotalAmount').val(subTotal.toFixed(2));
        $('#discount').val(discountAmount.toFixed(2))

        $('#formPay').submit();

        checkOutListCashier.splice(0);
        cartCount();
        localStorage.setItem('checkoutListCashier', JSON.stringify(checkOutListCashier));

    });

});


//break the name into small
function truncateName() {
    let names = document.querySelectorAll('.product-item-name span');

    names.forEach((item) => {
        if (item.textContent.length > 8) {
            item.textContent = item.textContent.substr(0, 6) + '...';
        }
    });
}

truncateName();


function CheckOutToggle() {
    $('.checkout-wrapper').slideToggle(1000, function () {


        const checkoutWrapper = $('.checkout-wrapper');
        checkoutWrapper.toggleClass('checkHide');

        if (checkoutWrapper.hasClass('checkHide')) {
            $('.product-list-wrapper').css({
                'width': '100%'
            })
            //$('.container-all').css({
            //    'width': "100%"
            //})

        } else {

            $('.product-list-wrapper').css({
                'width': "calc(100% - 340px)"
            })
        }

    });
}
//When exit button is click
$('.exitCheckout').click(function () {
    CheckOutToggle();
})

//adjusting the width of conten if sidebar was showed/hidden

$('.checkout-icon').click(function () {

    CheckOutToggle();

});

