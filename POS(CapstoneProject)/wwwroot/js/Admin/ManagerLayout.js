$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
 
});



function linkSave() {
    let links = document.querySelectorAll('.sidebar li a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
                   
            const currentUrl = window.location.href;        
            const linkUrl = link.href;
          
            if (currentUrl === linkUrl) {
               
                e.preventDefault();
            }

        });
    });
}

linkSave(); //call the function



