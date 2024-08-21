
let checkOutList =  [];



window.addEventListener('load', () => {
    const storedList = localStorage.getItem('checkoutList');
    if (storedList) {
        checkOutList = JSON.parse(storedList);
        DisplayCheckOut(); 
    }
});


//declare array to store objects (name and category)
let products = [];

//adding product to the array to be use in filtering based on category
function addProd() {
    let productElements = $('.product-item');
    productElements.each(function () {
        let name = $(this).find('.product-item-name span').text();
        let category = $(this).data('category');
        products.push({ name, category });
    });

}

addProd();

function FilterProduct(category) {
    $('.noResult').hide();
    $('.category-item').removeClass('active');
    $(event.target).addClass('active');

    //search
    let searchInput = document.querySelector('.searchProductInput').value.toLowerCase().trim();
   
    let filteredProducts = products.filter(function (product) {
        let isInCategory = product.category === category || category === 'All';
        let isInSearch = product.name.toLowerCase().includes(searchInput);
        return isInCategory && isInSearch;
    });

  
    $('.product-item').hide();

   
    filteredProducts.forEach(function (product) {
        let productItem = $('.product-item').filter(function () {
            return $(this).find('.product-item-name span').text() === product.name;
        });
        productItem.show();
    });

   
    if (filteredProducts.length === 0) {
        $('.noResult').show();
    }
}


//Display the check out products 
function DisplayCheckOut() {

    const tableBody = document.querySelector('.checkout-table tbody');
    let html = '';
    const storedList = localStorage.getItem('checkOutList');
    //if (storedList) {
    //    checkOutList = JSON.parse(storedList);
    //}
    checkOutList.forEach((item) => {

        const truncatedName = item.prodName.length > 8 ? `${item.prodName.substring(0, 8)}...` : item.prodName;
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
        
        product.prodQty += quantity;
    } else {
      
        checkOutList.push({
            prodID: id,
            prodName: name,
            prodQty: quantity,
            prodPrice: price
        });

        
    }
    localStorage.setItem('checkoutList', JSON.stringify(checkOutList));
    DisplayCheckOut();
   
}

//increment the quantity of product
function incrementQty(id) {
    const product = checkOutList.find((item) => item.prodID === id);
    if (product) {
        product.prodQty += 1;
        DisplayCheckOut();
       
    }
}

//decrement the quantity of product
function decrementQty(id) {
    const product = checkOutList.find((item) => item.prodID === id);
    if (product && product.prodQty > 1) {
        product.prodQty -= 1;
        DisplayCheckOut();
        
    }
}
//delete a specific item from the checklist
function deleteItem(id) {
    let index = checkOutList.findIndex(item => item.prodID === id);

    if (index !== -1) {
        checkOutList.splice(index, 1);
        DisplayCheckOut();
       
    }  
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

//adjusting the width of contens if sidebar was showed/hidden
function AdjustContent() {
    $('.checkout-icon').click(function () {

        $('.checkout-wrapper').slideToggle(1000, function () {

            const checkoutWrapper = $('.checkout-wrapper');
            checkoutWrapper.toggleClass('checkHide');

            if (checkoutWrapper.hasClass('checkHide')) {
                $('.product-list-wrapper').css({
                    'width': '100%'
                })
            }
            else {
                $('.product-list-wrapper').css({
                    'width': '68%'
                })
            }
        });

    })
}
AdjustContent();
//
$('.cancelBtn').click(function (){
    
    $('.checkout-wrapper').slideToggle(1000, function () {

        const checkoutWrapper = $('.checkout-wrapper');
        checkoutWrapper.toggleClass('checkHide');

        if (checkoutWrapper.hasClass('checkHide')) {
            $('.product-list-wrapper').css({
                'width': '100%'
            })
        }
        else {
            $('.product-list-wrapper').css({
                'width': '68%'
            })
        }
    });

    checkOutList.splice(0);

    DisplayCheckOut();
   
    
})


$('.payBtn').click(function () {
   
    if (checkOutList.length === 0) {

        swal({
            title: "",
            text: "You have no items in your check out list",
            icon: "error",
            button: false,
            timer: 2000
        }).show();

    } else {
        $('#paymentModal').modal('toggle')
        let total = CalculateTotalAmount();
        $('.totalAmountInputReadOnly').val(total.toFixed(2))
       
    }

});

function amountChange(){

    let totalAmo = CalculateTotalAmount();
    let money = Number($('.amountInput').val());
    let changeAmount = money - totalAmo;

    if (money >= totalAmo) {
        $('.changeAmountText').val(changeAmount.toFixed(2));
    }
    else {

        swal({
            title: "",
            text: "Insufficient Amount",
            icon: "error",
            button: false,
            timer: 2000
        }).then(() => {
            $('.amountInput').val('').focus();
        });
       
    }
 
}

function validateAmount(input) {
  
    let value = input.value;
   
    let validValue = value.match(/^\d*\.?\d{0,2}$/);

    if (validValue) {
        input.value = validValue[0]; 
    } else {
        input.value = ""; 
    }
}

$('.payComplete').click(function () {
    
    let amountInput = $('.amountInput').val();
    if (amountInput === '') {
        swal({
            title: "",
            text: "Cash tendered required",
            icon: "error",
            button: false,
            timer: 2000
        }).then(() => {

            document.querySelector('.amountInput').focus();
        });

    }
    else {

        let total = CalculateTotalAmount();
        let jsonData = JSON.stringify(checkOutList);
        let subTotal = Number(CalculateSubtotal());
        let cash = Number($('.amountInput').val());
        let changedue = Number($('.changeAmountText').val())
        let discount = Number($('#discount').val())

        $('#checkOutTotalInput').val(total)
        $('#checkOutListInput').val(jsonData);
        $('#totalString').val(total.toFixed(2))
        $('#cashTendered').val(cash.toFixed(2))
        $('#changeDueAmount').val(changedue.toFixed(2));
        $('#subTotalAmount').val(subTotal.toFixed(2));
        $('#discount').val(discount.toFixed(2))

     
      

      
        $('#formPay').submit();
    }

   
  
});


//live search for product
function searchProduct() {
    let searchInput = document.querySelector('.searchProductInput').value.toLowerCase().trim();
    let prodItem = document.querySelectorAll('.product-item');
    let selectedCategory = document.querySelector('.category-item.active')
    let categoryData = selectedCategory.getAttribute('data-category'); 
   
    let productList = [];
  

    prodItem.forEach((item) => {
        let productName = item.querySelector('.product-item-name').textContent.toLowerCase();
        let prodCat = item.getAttribute('data-category');
        item.style.display = "none";

        if (productName.includes(searchInput) && (categoryData === 'All' || categoryData === prodCat)) {
            item.style.display = "block";
            productList.push(item)
        }
        
        if (productList.length === 0) {

            $('.noResult').show();
        }
        else {
            $('.noResult').hide();
        }
    })
   
   
}


function truncateName() {
    let names = document.querySelectorAll('.product-item-name span');

    names.forEach((item) => {
        if (item.textContent.length > 8) {
            item.textContent = item.textContent.substr(0, 6) + '...';
        }
    });
}

truncateName();