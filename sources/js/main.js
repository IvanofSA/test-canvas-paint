let myPaintApp = (function () {

    let canvas = document.getElementById('canvasTemp'),
        mouse = {},
        x0 = 0,
        y0 = 0,
        mousedown = false,
        ctx;

    console.log(canvas);


    function init () {
        _initCanvas();
        _setUpListners();
    }

    function _initCanvas() {
        if(canvas.getContext) {
            ctx = canvas.getContext('2d');
        } else {
            console.log('canvas не поддерживается');
        }

        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150,150,70,0.25*Math.PI, 1.75*Math.PI);
        ctx.lineTo(150, 150);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }

    function _setUpListners() {
        $(canvas).on('mouseup', _mouseup);
        $(canvas).on('mousedown', _mousedown);
        $(canvas).on('mousemove', _startTracking);
        $(canvas).on('mouseleave', _stopTracking);
    }
    function _getCursorCoordinate(e) {
        let mouseX = e.pageX - canvas.offsetLeft,
            mouseY = e.pageY - canvas.offsetTop;

        return {
            x: mouseX,
            y: mouseY
        }
    }
    
    function _mousedown() {
        mousedown = true;
        x0 = _getCursorCoordinate(e).x;
        y0 = _getCursorCoordinate(e).y;
    }

    function _mouseup() {
        mousedown = false;

    }

    function _startTracking(e) {
        e.preventDefault();

        mouse.x = _getCursorCoordinate(e).x;
        mouse.y = _getCursorCoordinate(e).y;

        if(mousedown) {
            if(!started) {
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
            } else {
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
    
    
    return {
        init: init
    }


})();

$(document).ready(function () {

    myPaintApp.init();
});