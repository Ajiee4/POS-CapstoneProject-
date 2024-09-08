
let toggler = document.querySelector('.sidebar-toggler');
let sidebar = document.querySelector('.sidebar');
let sidebarName = document.querySelectorAll('.sidebar-link-name');
let submenu = document.querySelector('.sidebar ul ul');
let body = document.querySelector('body');


$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

window.addEventListener('load', () => {
    const sidebar = document.querySelector('.sidebar');
    const isOpen = localStorage.getItem('sidebarOpen') === 'true' ? true : false;

    if (isOpen) {
        sidebar.classList.add('openSidebar');
        toggleSidebar(); 
    }
});



toggler.addEventListener('click', function () {

    sidebar.classList.toggle('openSidebar')
    toggleSidebar();

});

$('.sidebar').click((event) => {
    if ($(event.target).is('.sidebar') && $(event.target).closest('.sidebar > *').length === 0) {
        sidebar.classList.toggle('openSidebar');
        toggleSidebar();
    }
});

toggleSidebar();
function toggleSidebar() {
   

    if (sidebar.classList.contains('openSidebar')) {


        sidebar.style.width = "180px"
        submenu.style.left = '180px'
        body.style.paddingLeft = '190px'
        toggler.style.transform = "rotate(0deg)"
        sidebarName.forEach((link) => {
            setTimeout(() => {
                link.style.display = "block";

            }, 200)

        });

    }
    else {

        body.style.paddingLeft = '65px'
        sidebar.style.width = "55px"
        submenu.style.left = '55px'
        toggler.style.transform = "rotate(180deg)"
        sidebarName.forEach((link) => {
            setTimeout(() => {
                link.style.display = "none";

            }, 100)

        });

    }
}


function linkSave() {
    let links = document.querySelectorAll('.sidebar li a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.sidebar');
            const isOpen = sidebar.classList.contains('openSidebar');

           
            localStorage.setItem('sidebarOpen', isOpen);

           
            const currentUrl = window.location.href;

          
            const linkUrl = link.href;

           
            if (currentUrl === linkUrl) {
               
                e.preventDefault();
            }
        });
    });
}

linkSave();



