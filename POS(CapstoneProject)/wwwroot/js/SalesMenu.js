
const checkOutList = [];
let products = [];

let productElements = $('.product-item');
productElements.each(function () {
        let name = $(this).find('.product-item-name span').text();
        let category = $(this).data('category');
        products.push({ name, category });
    });



function FilterProduct(category) {

    $('.category-item').removeClass('active'); 
    $(event.target).addClass('active'); 
   
   
    let filteredProducts = products.filter(function (product) {
        return product.category === category || category === 'All';
    });

    console.log(filteredProducts)
    $('.product-item').hide();  
    filteredProducts.forEach(function (product) {
        let productItem = $('.product-item[data-category="' + product.category + '"]');
        productItem.show(); 
    });
}


function DisplayCheckOut() {

    const tableBody = document.querySelector('.checkout-table tbody');
    let html = '';
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
    $('.payBtn').text(`Pay (₱${CalculateTotalAmount()})`)
    subTotalText.innerHTML = `₱${CalculateSubtotal()}`;
    totalAmountText.innerHTML = `₱${CalculateTotalAmount()}`;

}


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
   
    DisplayCheckOut();
   
}


function incrementQty(id) {
    const product = checkOutList.find((item) => item.prodID === id);
    if (product) {
        product.prodQty += 1;
        DisplayCheckOut();
       
    }
}


function decrementQty(id) {
    const product = checkOutList.find((item) => item.prodID === id);
    if (product && product.prodQty > 1) {
        product.prodQty -= 1;
        DisplayCheckOut();
        
    }
}
//delete a specific item
function deleteItem(id) {
    let index = checkOutList.findIndex(item => item.prodID === id);

    if (index !== -1) {
        checkOutList.splice(index, 1);
        DisplayCheckOut();
       
    }  
}



//discount not yet applied
function CalculateSubtotal() {
    let subtotal = 0;
    checkOutList.forEach((item) => {
        subtotal += (item.prodPrice * item.prodQty);
    })
    subtotal = subtotal.toFixed(2);
    return subtotal;
  
};

//calculate total amount
function CalculateTotalAmount() {
    let subTotal = CalculateSubtotal();
    let discount = $('#inputDiscount').val();
    let discountAmount = subTotal * (discount / 100);
    let totalAmount = subTotal - discountAmount;

    totalAmount = totalAmount.toFixed(2)
   
    return totalAmount;
}
//discount input change
function ApplyDiscount() {
    let totalAmountText = document.querySelector('.TotalAmount');
    CalculateTotalAmount();  
    $('.payBtn').text(`Pay (₱${CalculateTotalAmount()})`)
    totalAmountText.innerHTML = `₱${CalculateTotalAmount() }`;
}

//only number can be entered
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

$('.checkout-icon').click(function () {

    $('.checkout-wrapper').slideToggle(1000 ,function () {
       
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



    $('.payBtn').click(function () {
        let total = CalculateTotalAmount();
   
        let jsonData = JSON.stringify(checkOutList);
        $('#checkOutTotalInput').val(total)
        $('#checkOutListInput').val(jsonData);
        $('#formPay').submit();
    })
   

/*    $('.checkOutListInput')*/
