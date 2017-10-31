let myPaintApp = (function () {

    let canvas = document.getElementById('canvasTemp'),
        canvasCopy = document.getElementById('canvasCopy'),
        mouse = {},
        x0 = 0,
        y0 = 0,
        started = false,
        mousedown = false,
        curColor = '#cb3594',
        curSize = 10,
        curTool = 'marker',
        ctxCopy,
        ctx;


    function init () {
        _initCanvas();
        _setUpListners();
    }

    function _initCanvas() {
        if(canvas.getContext) {
            ctx = canvas.getContext('2d');
            ctxCopy = canvasCopy.getContext('2d');
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
        $('.btn-tool').on('click', _switchTool);
        $('.btn-color').on('click', _setColor);
        $('.btn-size').on('click', _setSize);
        $('.btn-clear').on('click', _clearCanvas);
        $('.btn-save').on('click', _saveCanvas);

    }

    function _getCursorCoordinate(e) {
        let mouseX = e.pageX - canvas.offsetLeft,
            mouseY = e.pageY - canvas.offsetTop;

        return {
            x: mouseX,
            y: mouseY
        }
    }
    
    function _mousedown(e) {
        mousedown = true;
        x0 = _getCursorCoordinate(e).x;
        y0 = _getCursorCoordinate(e).y;
    }

    function _setColor(e) {
        e.preventDefault();
        curColor = $(this).css('background-color');
        console.log(curColor);
    }

    function _setSize(e) {
        e.preventDefault();
        curSize = $(this).width();
    }

    function _clearCanvas(e) {
        e.preventDefault();
        ctxCopy.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    function _saveCanvas(e) {
        e.preventDefault();

        var link = document.createElement('a');
        link.setAttribute('download', 'image.png');
        link.setAttribute('href',  canvasCopy.toDataURL('image/png'));
        link.setAttribute('target', '_blank');
        onload = link.click();

    }

    function _mouseup(e) {
        mousedown = false;
        started = false;

        _imgUpdate();
    }

    function _stopTracking(e) {
        _mouseup();
    }

    function _imgUpdate() {
        ctxCopy.drawImage(canvas, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    function _startTracking(e) {
        e.preventDefault();

        mouse.x = _getCursorCoordinate(e).x;
        mouse.y = _getCursorCoordinate(e).y;

        if (mousedown) {
            ctx.strokeStyle = curColor;
            ctx.lineWidth = curSize;
            _setTool(e, curTool);
        }
    }
    
    function _switchTool(e) {
        e.preventDefault();
        curTool = $(this).attr('data-name');
    }

    function _setTool(e, curTool) {
        switch (curTool) {
            case 'marker':
                return function () {
                    if(!started) {
                        ctx.beginPath();
                        ctx.moveTo(mouse.x, mouse.y);
                        started = true;
                    } else {
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }();

                break;
            case 'rectangle':
                return function () {
                    let x = Math.min(mouse.x, x0),
                        y = Math.min(mouse.y, y0),
                        w = Math.abs(mouse.x - x0),
                        h = Math.abs(mouse.y - y0);

                    if(!w || !h) {
                        return;
                    }
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.strokeRect(x, y, w, h);
                }();

                break;
            case 'line':
                return function () {
                    ctx.beginPath();
                    ctx.moveTo(x0, y0);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }();

                break;

            case 'eraser':
                return function () {
                    curColor = $(canvasCopy).css('background-color');
                    console.log(curColor);
                    ctx.strokeStyle = curColor;
                    _setTool(e, 'marker');
                }();
                break;
        }
    }

    
    return {
        init: init
    }


})();

$(document).ready(function () {

    myPaintApp.init();
});