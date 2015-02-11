var Input = {
    _pressed: {},
    Up: 38,
    Down: 40,
    Left: 37,
    Right: 39,
    Restart: 82,

    click: 0,
    space: 32,

    mX: null,
    mY: null,


    init: function () {
        //Considered using a function to adding the event listeners, however decided to do it the longer more simplier way and save some unnecessary calls to a function passing parameters.
        window.addEventListener('keyup', function (e) {
            Input.onUp(e.keyCode);
        }, false);

        window.addEventListener('keydown', function (e) {
            Input.onDown(e.keyCode);
        }, false);

        window.addEventListener('mousedown', function (e) {
            Input.onDown(e.button)
        }, false);

        window.addEventListener('mouseup', function (e) {
            Input.onUp(e.button)
        }, false);

        cvs.addEventListener('mousemove', function (e) {
            Input.getPos(e);
        }, false);
    },

    isDown: function (input) {
        return this._pressed[input];
    },

    onDown: function (e) {
        this._pressed[e] = true;
    },

    onUp: function (e) {
        delete this._pressed[e];
    },

    getPos: function (e) {
        //FireFox does not support offsetX and Y
        this.mX = e.offsetX || e.layerX;
        this.mY = e.offsetY || e.layerY;
    }
};