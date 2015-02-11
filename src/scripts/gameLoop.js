var GameLoop = new function () {
    var self = this;
    this.lastGameLoopFrame = 0;
    this.objects = [];
    this.bgObjects = [];
    this.ctx = null;

    this.start = function (ctx) {
        this.ctx = ctx;
        window.requestAnimationFrame(self.loop);
    };

    this.add = function (obj) {
        this.objects.push(obj);
    };

    this.addBG = function (obj) {
        this.bgObjects.push(obj);
    };

    this.remove = function (obj) {
        var i = this.objects.indexOf(obj);
        if(i != -1) {
            this.objects.splice(i, 1);
        }
    };

    this.loop = function () {
        window.requestAnimationFrame(self.loop);
        var now = new Date().getTime(),
            dt = (now - self.lastGameLoopFrame) / 100;
        /* Prevent fast-forwarding by limiting the length of a single frame. */
        if (dt > 1)
            dt = 1;

        //UPDATE
        for (var i = 0; i < self.objects.length; i++) {
            self.objects[i].update(dt);
        }

        for (var i = 0; i < self.bgObjects.length; i++) {
            self.bgObjects[i].update(dt);
        }

        //DRAW
        self.ctx.clearRect(0, 0, cvs.width, cvs.height); //clear

        for (var i = 0; i < self.bgObjects.length; i++) {
            self.bgObjects[i].draw(self.ctx);
        }


        for (var i = self.objects.length - 1; i >= 0; i--) {
            self.objects[i].draw(self.ctx);
        }

        self.lastGameLoopFrame = now;
    };
};