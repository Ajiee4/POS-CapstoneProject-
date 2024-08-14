
SidebarToggle();
SubmenuToggler();

function openSidebar() {
    let inventorySubmenuToggler = document.querySelector('.sidebarlink-inventory-toggler');
    let sidebar = document.querySelector('.sidebar'); //sidebar
    let toggler = document.querySelector('.sidebar-toggler'); //sidebar toggler
    let sidebarName = document.querySelectorAll('.sidebar-link-name'); //sidebar link name

    sidebar.style.width = "180px"
    toggler.style.transform = "rotate(0deg)"
    sidebarName.forEach((link) => {

        link.style.display = "block";

    });
    inventorySubmenuToggler.style.display = "block";

   
}
function closeSidebar() {
    let inventorySubmenuToggler = document.querySelector('.sidebarlink-inventory-toggler');
    let sidebar = document.querySelector('.sidebar'); //sidebar
    let toggler = document.querySelector('.sidebar-toggler'); //sidebar toggler
    let sidebarName = document.querySelectorAll('.sidebar-link-name'); //sidebar link name
    let inventorySubmenu = document.querySelector('.inventorySubmenu');
    sidebar.style.width = "65px"
    toggler.style.transform = "rotate(180deg)"
    sidebarName.forEach((link) => {
        link.style.display = "none";
    });
    inventorySubmenuToggler.style.display = "none";
    inventorySubmenu.style.display = "none";
}
function SidebarToggle() {
    let sidebar = document.querySelector('.sidebar'); //sidebar
    let toggler = document.querySelector('.sidebar-toggler'); //sidebar toggler
    toggler.addEventListener('click', function () {

        sidebar.classList.toggle('openSidebar')

        if (sidebar.classList.contains('openSidebar')) {

           
            openSidebar();

        }
        else {
           
            
            closeSidebar();

        }
    });
}

function SubmenuToggler() {
    $('.inventoryMenu').click(() => {

        var sidebar = document.querySelector('.sidebar')

        if (sidebar.offsetWidth < 80) {
            alert('hi')
            sidebar.classList.add('openSidebar');

            openSidebar();
            let inventorySubmenu = document.querySelector('.inventorySubmenu');
            inventorySubmenu.style.display = "block";
        }
        else {

            let submenuToggler = document.querySelector('.sidebarlink-inventory-toggler');
            let inventoryMenu = document.querySelector('.inventoryMenu')
            inventoryMenu.classList.toggle('open')
            $('.inventorySubmenu').slideToggle(500);


            if (inventoryMenu.classList.contains('open')) {

                submenuToggler.style.transform = "rotate(90deg)"
            }
            else {
                submenuToggler.style.transform = "rotate(270deg)"
            }
        }
    });
}










//let activeLink = localStorage.setItem('activeLink', "/DashboardMenu/Index");
//const linkToActivate = document.querySelector(`.sidebar ul li a[href="${activeLink}"]`);
//linkToActivate.style.backgroundColor = "#C6976C";

//const sidebarLinks = document.querySelectorAll('.sidebar ul li a');


//const activeLink = localStorage.getItem('activeLink');

//console.log(activeLink)

//if (activeLink) {
   
//    const linkToActivate = document.querySelector(`.sidebar ul li a[href="${activeLink}"]`);
//    if (linkToActivate) {
//        linkToActivate.style.background = "#C6976C";
//    }
//}

//sidebarLinks.forEach(link => {
//    link.addEventListener('click', function () {
        
//        //localStorage.setItem('activeLink', this.getAttribute('href'));
      

        
//    });
//});