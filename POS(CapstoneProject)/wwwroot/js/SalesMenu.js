//import { checkOutList } from './data/checkout.js';
//console.log(checkOutList);


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