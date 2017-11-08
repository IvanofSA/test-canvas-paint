class Paint {

    constructor(data) {
        this.canvas = document.getElementById(data.canvas);
        this.canvasCopy = document.getElementById(data.canvasCopy);
        this.mouse = {};
        this.startX = 0;
        this.startY = 0;
        this.started = false;
        this.mousedown = false;
        this.curColor = '#000';
        this.curSize = 1;
        this.curTool = 'marker';
        this.ctx = {};
        this.ctxCopy = {};
        this.btnSetColor = document.querySelector('.btn-color');
        this.btnSetTool = document.querySelector('.btn-tool');
        this.btnSetClear = document.querySelector('.btn-clear');
        this.btnSetSave = document.querySelector('.btn-save');
        this.rangeSize = document.querySelector('.range-size');

    }

    init() {
        this._initCanvas();
        this._addEventListners();
    }

    _initCanvas() {
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
            this.ctxCopy = this.canvasCopy.getContext('2d');
        } else {
            console.log('canvas не поддерживается');
        }
    }

    _addEventListners() {
        let that = this;

        this.canvas.addEventListener('mouseup', (e) => {
            that._mouseup(e);
        });
        this.canvas.addEventListener('mousedown', (e) => {
            that._mousedown(e);
        });
        this.canvas.addEventListener('mousemove', (e) => {
            that._startTracking(e);
        });
        this.canvas.addEventListener('mouseleave', (e) => {
            that._stopTracking(e);
        });

        document.addEventListener('click', (e) => {
            if(e.target.classList.contains('btn-tool')) {
                that._switchTool(e, e.target);
            }
        });
        document.addEventListener('click', (e) => {
            if(e.target.classList.contains('btn-color')) {
                this._setColor(e, e.target);
            }
        });
        document.addEventListener('click', (e) => {
            if(e.target.classList.contains('btn-size')) {
                that._setSize(e, e.target);
            }
        });
        this.rangeSize.addEventListener('input', (e) => {
            let line = this.rangeSize.value;
            let my = document.querySelector('.range-size_current-value');
            console.log(my);
            my.innerHTML =line;
            this.curSize = line;

        });

        this.btnSetClear.addEventListener('click', (e) => {
            that._clearCanvas(e);
        });
        this.btnSetSave.addEventListener('click', (e) => {
            that._saveCanvas(e);
        });
    }


    _getCursorCoordinate(e) {
        let mouseX = e.pageX - this.canvas.offsetLeft,
            mouseY = e.pageY - this.canvas.offsetTop;

        return {
            x: mouseX,
            y: mouseY
        }
    }

    _mousedown(e) {
        let that = this;
        this.mousedown = true;
        this.startX = that._getCursorCoordinate(e).x;
        this.startY = that._getCursorCoordinate(e).y;
    }

    _mouseup(e) {
        this.mousedown = false;
        this.started = false;
        this._imgUpdate();
    }

    _stopTracking(e) {
        this._mouseup();
    }


    _startTracking(e) {
        e.preventDefault();
        this.mouse.x = this._getCursorCoordinate(e).x;
        this.mouse.y = this._getCursorCoordinate(e).y;

        if (this.mousedown) {
            this.ctx.strokeStyle = this.curColor;
            this.ctx.lineWidth = this.curSize;
            this._setTool(e, this.curTool);
        }
    }

    _imgUpdate() {
        this.ctxCopy.drawImage(this.canvas, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    _setTool(e, curTool) {

        let that = this;
        switch (curTool) {
            case 'marker':
                return function () {
                    if (!that.started) {
                        that.ctx.beginPath();
                        that.ctx.moveTo(that.mouse.x, that.mouse.y);
                        that.started = true;
                    } else {
                        that.ctx.lineTo(that.mouse.x, that.mouse.y);
                        that.ctx.stroke();
                    }
                }();

                break;
            case 'rectangle':
                return function () {
                    let x = Math.min(that.mouse.x, that.startX),
                        y = Math.min(that.mouse.y, that.startY),
                        w = Math.abs(that.mouse.x - that.startX),
                        h = Math.abs(that.mouse.y - that.startY);

                    if (!w || !h) {
                        return;
                    }
                    that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
                    that.ctx.strokeRect(x, y, w, h);
                }();

                break;
            case 'line':
                return function () {
                    that.ctx.beginPath();
                    that.ctx.moveTo(that.startX, that.startY);
                    that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
                    that.ctx.lineTo(that.mouse.x, that.mouse.y);
                    that.ctx.stroke();
                }();

                break;

            case 'eraser':
                return function () {
                    that.curColor = $(canvasCopy).css('background-color');
                    that.ctx.strokeStyle = that.curColor;
                    that._setTool(e, 'marker');
                }();
                break;
        }
    }

    _setColor(e, item) {
        e.preventDefault();

        this.curColor = $(item).css('background-color');
    }


    _switchTool(e, item) {
        let that = this;
        e.preventDefault();
        that.curTool = $(item).attr('data-name');

        console.log(that.curTool);
    }

    _clearCanvas(e) {
        e.preventDefault();
        this.ctxCopy.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    _saveCanvas(e) {
        e.preventDefault();

        let link = document.createElement('a');
        link.setAttribute('download', 'image.jpg');
        link.setAttribute('href', this.canvasCopy.toDataURL('image/jpg'));
        link.setAttribute('target', '_blank');
        onload = link.click();

    }
}

export default Paint;