
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

function DisplayCheckOut() {
    let result = ''
    let tablebody = document.querySelector('.checkout-table tbody');
    checkOutList.forEach((item) => {
        let longName = item.prodName;
        if (item.prodName.length > 8) {
            longName = longName.substring(0, 8) + '...';
        }
            result +=
                `
             <tr >
                    <td style="padding: 10px">
                            <img src="/images/delete-black.png" class="delete-checkout-img d-block mx-auto" onclick="deleteItem(${item.prodID})"/>
                    </td>
                    <td class="table-data-name">
                        ${longName}
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
   
    tablebody.innerHTML = result;
}
function incrementQty(id) {
    let getindex = checkOutList.find((item) => item.prodID == id);
    checkOutList[getindex].prodQty += 1;
    
    DisplayCheckOut();
}
function decrementQty(id) {
    let getindex = checkOutList.find((item) => item.prodID == id);

    if (checkOutList[getindex].prodQty > 1) {
        checkOutList[getindex].prodQty -= 1;
        
    }      
   
    DisplayCheckOut();
}

function deleteItem(id) {
    let getindex = checkOutList.find((item) => item.prodID == id);
    checkOutList.splice(getindex, 1);

    DisplayCheckOut();
}