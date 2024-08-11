function toggleSideBar() {
    let toggler = document.querySelector('.sidebar-toggler');
    let sidebar = document.querySelector('.sidebar');

    let sidebarName = document.querySelectorAll('.sidebar-link-name');

    toggler.addEventListener('click', () => {
        sidebar.classList.toggle('open');

        if (sidebar.classList.contains('open')) {
            sidebar.style.width = "180px"
            toggler.style.transform = "rotate(0deg)"
            sidebarName.forEach((link) => {
                link.style.display = "block";
            });

           
        }
        else {
            sidebar.style.width = "65px"
            toggler.style.transform = "rotate(180deg)"
            sidebarName.forEach((link) => {
                link.style.display = "none";
            });
        }
       
       
       
    })
}

toggleSideBar();




const sidebarLinks = document.querySelectorAll('.sidebar ul li a');


const activeLink = localStorage.getItem('activeLink');

if (activeLink) {
   
    const linkToActivate = document.querySelector(`.sidebar ul li a[href="${activeLink}"]`);
    if (linkToActivate) {
        linkToActivate.style.background = "#C6976C";
    }
}

sidebarLinks.forEach(link => {
    link.addEventListener('click', function () {
        
        localStorage.setItem('activeLink', this.getAttribute('href'));

        
    });
});