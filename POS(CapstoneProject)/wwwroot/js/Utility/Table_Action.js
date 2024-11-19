


function hoverOverUpdate() {
    let buttonsArchive = document.querySelectorAll('.general-archive-btn');
    let buttonsUnArchive = document.querySelectorAll('.general-unarchive-btn');
    let buttonsUpdate = document.querySelectorAll('.general-update-btn');
    let buttonsDetail = document.querySelectorAll('.general-details-btn');

    buttonsArchive.forEach(item => {

        item.addEventListener('mouseover', () => {
            item.querySelector('.general-archive-btn img').src = "/images/archive_white.png";
            item.style.backgroundColor = "#F71F1F";

        });

    });
    buttonsUnArchive.forEach(item => {

        item.addEventListener('mouseover', () => {
            item.querySelector('.general-unarchive-btn img').src = "/images/unarchive_white.png";
            item.style.backgroundColor = "#059224";

        });

    });

    buttonsDetail.forEach(item => {

        item.addEventListener('mouseover', () => {
            item.querySelector('.general-details-btn img').src = "/images/details_white.png";
            item.style.backgroundColor = "#6D6868";

        });

    });

    buttonsUpdate.forEach(item => {

        item.addEventListener('mouseover', () => {
            item.querySelector('.general-update-btn img').src = "/images/edit_white.png";
            item.style.backgroundColor = "#693D29";

        });

    });

 
}

function hoverOutUpdate() {
    let buttonsArchive = document.querySelectorAll('.general-archive-btn');
    let buttonsUpdate = document.querySelectorAll('.general-update-btn');
    let buttonsUnArchive = document.querySelectorAll('.general-unarchive-btn');
    let buttonsDetail = document.querySelectorAll('.general-details-btn');

    buttonsArchive.forEach(item => {

        item.addEventListener('mouseout', () => {
            item.querySelector('.general-archive-btn img').src = "/images/a-archive.png";
            item.style.backgroundColor = "transparent";
        });


    })

    buttonsUnArchive.forEach(item => {

        item.addEventListener('mouseout', () => {
            item.querySelector('.general-unarchive-btn img').src = "/images/a-unarchive.png";
            item.style.backgroundColor = "transparent";
        });


    })

    buttonsDetail.forEach(item => {

        item.addEventListener('mouseout', () => {
            item.querySelector('.general-details-btn img').src = "/images/a-details.png";
            item.style.backgroundColor = "transparent";
        });


    })

    buttonsUpdate.forEach(item => {

        item.addEventListener('mouseout', () => {
            item.querySelector('.general-update-btn img').src = "/images/a-edit.png";
            item.style.backgroundColor = "transparent";
        });


    })

 
}


//function hoverOverArchive() {
//    let buttonsUpdate = document.querySelectorAll('.general-update-btn');

//    buttonsUpdate.forEach(item => {

//        item.addEventListener('mouseover', () => {
//            item.querySelector('.general-archive-btn img').src = "/images/archive_white.png";
//            item.style.backgroundColor = "#F71F1F";

//        });


//    });


//}
//function hoverOutArchive() {
//    let buttons = document.querySelectorAll('.general-update-btn');

//    buttons.forEach(item => {

//        item.addEventListener('mouseout', () => {
//            item.querySelector('.general-archive-btn img').src = "/images/a-archive.png";
//            item.style.backgroundColor = "transparent";
//        });


//    })


//}

//hoverOverArchive();
//hoverOutArchive();
hoverOverUpdate();
hoverOutUpdate();