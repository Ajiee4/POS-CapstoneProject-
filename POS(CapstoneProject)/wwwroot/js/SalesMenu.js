
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

   
    $('.product-item').hide();  
    filteredProducts.forEach(function (product) {
        let productItem = $('.product-item[data-category="' + product.category + '"]');
        productItem.show(); 
    });
}

//Checkout



//let increment = document.querySelector('.incrementBtn');
//let decrement = document.querySelector('.decrementBtn');
//let quantity = Number(document.querySelector('.quantity-table-data .quantity').textContent)
//increment.addEventListener('click', function () {
//    quantity += 1;
//  console.log(quantity)

//});

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
    alert('hi')
    console.log(checkOutList);

    DisplayCheckOut();
}

function DisplayCheckOut() {
    let result = ''
    let tablebody = document.querySelector('.checkout-table tbody');
    checkOutList.forEach((item) => {
        result +=
            `
             <tr >
                    <td style="padding: 10px">
                            <img src="/images/delete-black.png" class="delete-checkout-img d-block mx-auto" />
                    </td>
                    <td class="table-data-name">
                        ${item.prodName}
                    </td>
                    <td class="table-data-quantity">
                        <div class="quantity-table-data">
                            <span class="button decrementBtn">
                                <img src="/images/minus-sign.png" />
                            </span>

                            <span class="quantity">${item.prodQty}</span>

                            <span class="button incrementBtn">
                                <img src="/images/plus.png" />
                           </span>
                        </div>

                    </td>

                    <td class="table-data-price">₱${item.prodPrice}</td>
                </tr>
                      
            
            `

        
    });
   
    tablebody.innerHTML = result;
}

