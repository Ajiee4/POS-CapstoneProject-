function toggleSideBar() {
    let toggler = document.querySelector('.sidebar-toggler');
    let sidebar = document.querySelector('.sidebar');
    let sidebarName = document.querySelectorAll('.sidebar-link-name');

    toggler.addEventListener('click', () => {
        sidebar.classList.toggle('open');

        if (sidebar.classList.contains('open')) {
            sidebar.style.width = "180px"
            sidebarName.forEach((link) => {
                link.style.display = "block";
            });

           
        }
        else {
            sidebar.style.width = "65px"
          
            sidebarName.forEach((link) => {
                link.style.display = "none";
            });
        }
       
       
       
    })
}

toggleSideBar();