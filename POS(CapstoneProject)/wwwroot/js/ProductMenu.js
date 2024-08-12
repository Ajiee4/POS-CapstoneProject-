$(document).ready(function () {
    $('.product-table').DataTable({
        "paging": true,
        "scrollY": true,
        "searching": true,
        "ordering": true,
        "pageLength": 5

    });

});

$('.uploadPhoto').click(function () {

    $('.inputPhoto').click();
});

$('.inputPhoto').change(function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        $('.photo-wrapper img').attr('src', e.target.result);
    };

    reader.readAsDataURL(file);
});






$('.archiveBtn').click(function () {

    $('.archiveForm').submit();
})
$('.unarchiveBtn').click(function () {

    $('.unarchiveForm').submit();
})
