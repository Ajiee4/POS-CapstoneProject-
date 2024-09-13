
//array of objects
let checkOutList =  [];





//get the data from the locale storage and store it in the checkoutlist array
window.addEventListener('load', () => {
    const storedList = localStorage.getItem('checkoutList');
    if (storedList) {
        checkOutList = JSON.parse(storedList);
        DisplayCheckOut(); 
        cartCount();
    }


});

function cartCount() {
    let sum = 0;
    checkOutList.forEach((item) => {
        sum += item.prodQty
    });
    $('.cart-count').text(sum);

   /* alert(sum);*/
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
    const storedList = localStorage.getItem('checkOutList');
    checkOutList.forEach((item) => {

        const truncatedName = item.prodName.length > 10 ? `${item.prodName.substring(0, 10)}...` : item.prodName;
        html +=
            `
             <tr >
                    <td style="padding: 10px">
                            <img src="/images/delete-black.png" class="delete-checkout-img d-block mx-auto" onclick="deleteItem(${item.prodID})"/>
                    </td>
                    <td class="table-data-name">
                        ${truncatedName}
                    </td>
                    <td class="table-data-quantity">
                        <div class="quantity-table-data">
                            <span class="button decrementBtn" onclick="decrementQty(${item.prodID})">
                                <img src="/images/minus-sign.png" />
                            </span>

                            <span class="quantity">${item.prodQty}</span>

                            <span class="button incrementBtn" onclick="incrementQty(${item.prodID})">
                                <img src="/images/plus.png" />
                           </span>
                        </div>

                    </td>

                    <td class="table-data-price">₱${item.prodPrice} &nbsp;</td>
                </tr>
                                 
            `
    });

    tableBody.innerHTML = html;

    let subTotalText = document.querySelector('.subTotalValue');
    let totalAmountText = document.querySelector('.TotalAmount');
    $('.payBtn').text(`Pay (₱${CalculateTotalAmount().toFixed(2)})`)
    subTotalText.innerHTML = `₱${CalculateSubtotal().toFixed(2)}`;
    totalAmountText.innerHTML = `₱${CalculateTotalAmount().toFixed(2)}`;

}

//add the clicked product to the checklist
//call the display funct to show in the checklist
function checkoutProduct(id, name, quantity, price) {

    let product = checkOutList.find(item => item.prodID === id);

    if (product) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            width: 300,
            showConfirmButton: false,
            timer: 1500,

        });
        Toast.fire({
            icon: "success",
            title: "Quantity incremented"
        });

        product.prodQty += quantity;
    } else {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            width: 250,
            showConfirmButton: false,
            timer: 1500,

        });
        Toast.fire({
            icon: "success",
            title: "Product Added"
        });

        checkOutList.push({
            prodID: id,
            prodName: name,
            prodQty: quantity,
            prodPrice: price
        });

        
    }
    localStorage.setItem('checkoutList', JSON.stringify(checkOutList));
    DisplayCheckOut();
    cartCount();
   
}

//increment the quantity of product
function incrementQty(id) {
    const product = checkOutList.find((item) => item.prodID === id);
    if (product) {
        product.prodQty += 1;
        DisplayCheckOut();
        cartCount();
    }
   
    localStorage.setItem('checkoutList', JSON.stringify(checkOutList));
}

//decrement the quantity of product
function decrementQty(id) {
    const product = checkOutList.find((item) => item.prodID === id);
    if (product && product.prodQty > 1) {
        product.prodQty -= 1;
        DisplayCheckOut();
        cartCount();
        
    }
  
    localStorage.setItem('checkoutList', JSON.stringify(checkOutList));
}
//delete a specific item from the checklist
function deleteItem(id) {
    let indexItem = checkOutList.findIndex(item => item.prodID === id);

    if (indexItem !== -1) {
        checkOutList.splice(indexItem, 1);
        DisplayCheckOut();
        cartCount();
       
    }  
    
    localStorage.setItem('checkoutList', JSON.stringify(checkOutList));
}



//discount not yet applied; subtotal
function CalculateSubtotal() {
    let subtotal = 0;
    checkOutList.forEach((item) => {
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
function ApplyDiscount() {
    let totalAmountText = document.querySelector('.TotalAmount');

    CalculateTotalAmount();  
    $('.payBtn').text(`Pay (₱${CalculateTotalAmount().toFixed(2)})`)
    totalAmountText.innerHTML = `₱${CalculateTotalAmount().toFixed(2)}`;
}

//only number can be entered in the discount input
function validateInput(input) {
   
    input.value = input.value.replace(/[^0-9]/g, '');
    
    
}

//default value is 0
document.querySelector('#inputDiscount').addEventListener('change', function () {
    const inputDiscount = document.querySelector('#inputDiscount');
    const inputValue = inputDiscount.value.trim();

    if (!inputValue) {
        inputDiscount.value = 0;
    }
});
//cancel order

$('.cancelBtn').click(function (){
    
    CheckOutToggle();

    checkOutList.splice(0);

    DisplayCheckOut();
    cartCount();
    localStorage.setItem('checkoutList', JSON.stringify(checkOutList));
    
})


$('.payBtn').click(function () {
   
    if (checkOutList.length === 0) {
        popUpMessageSales("Your check out list is empty", "error");

    } else {
        $('#paymentModal').modal('toggle')
        let total = CalculateTotalAmount();
        $('.totalAmountInputReadOnly').val(total.toFixed(2))
       
    }

});
function inputAmountChange() {
    $('#paymentModal .calculateBtn').css({
        "display": "none",

    })
    $('.changeAmountText').val('');
}
function validateAndCalculateAmount() {
   
    let input = $('.amountInput');
    let value = input.val(); 
    let validValue = value.match(/^\d+(\.\d{0,2})?$/);

    if (validValue) {
       
        let totalAmo = CalculateTotalAmount();
        let money = Number(validValue[0]);
        let changeAmount = money - totalAmo;

        if (money >= totalAmo) {
            $('.changeAmountText').val(changeAmount.toFixed(2));

            $('#paymentModal .calculateBtn').css({
                "display": "block",
                "margin": "0px auto"

            })
        } else {
            $('#paymentModal .calculateBtn').css({
                "display": "none",
            })
            popUpMessageSales("Insufficient Amount", "error");
            input.val('').focus();
            $('.changeAmountText').val('');
        }
    } else {
       
        popUpMessageSales("Only numbers are allowed", "error");
        input.val('');
    }
}
//validates the cash tendered

$('.calculateBtn').click(function () {
  
    Swal.fire({
        icon: "question",
        title: "Confirm payment? <br>",

        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        customClass: {
            icon: 'custom-icon',
            title: 'swal-sales-title',

        }

    }).then((result) => {

        if (result.isConfirmed) {

            let total = CalculateTotalAmount();
            let jsonData = JSON.stringify(checkOutList);
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

            checkOutList.splice(0);
            cartCount();
            localStorage.setItem('checkoutList', JSON.stringify(checkOutList));

        }
    });
   
  
});

//if the name is greater than 8
function truncateName() {
    let names = document.querySelectorAll('.product-item-name span');

    names.forEach((item) => {
        if (item.textContent.length > 8) {
            item.textContent = item.textContent.substr(0, 6) + '...';
        }
    });
}

truncateName();

function popUpMessageSales(message, icon) {
    Swal.fire({
        text: message,
        icon: icon,
        padding: '1em',
        showConfirmButton: false,
        timer: 2000,

    });
}



function CheckOutToggle() {
    $('.checkout-wrapper').slideToggle(1000, function () {

      
        const checkoutWrapper = $('.checkout-wrapper');
        checkoutWrapper.toggleClass('checkHide');

        if (checkoutWrapper.hasClass('checkHide')) {
            $('.product-list-wrapper').css({
                'width': '100%'
            })
        } else {
            $('.product-list-wrapper').css({
                'width': "calc(100% - 340px)"
            })
        }
  
    });
}

$('.exitCheckout').click(function () {
    CheckOutToggle();
})
//adjusting the width of conten if sidebar was showed/hidden

$('.checkout-icon').click(function () {

    CheckOutToggle();

});
