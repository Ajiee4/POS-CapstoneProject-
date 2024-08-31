


function barchart() {

    var barColor = ['red', 'green', 'blue', 'orange', 'yellow']

    var bars = document.querySelectorAll('.bar');

    bars.forEach(function (bar) {
        var count = parseInt(bar.querySelector('.count').textContent);
        bar.style.height = count * 10 + 'px';
        var randomInteger = Math.floor(Math.random() * 5);
        bar.style.backgroundColor = barColor[randomInteger];
    });
}