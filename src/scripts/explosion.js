function Explosion(x, y) {
    this.x = x;
    this.y = y;
    this.partials = [];
    this.alpha = 1.0;
    this.flasher = null;
    this.flash = false;

    var t = ~~(Math.random() * 16) + 12;
    for (var i = 0; i < t; i++) {
        var p = new Box(x, y, 5, 5);
        p.vx = ~~(Math.random() * 18) - 11;
        p.vy = ~~(Math.random() * 18) - 17;
        this.partials.push(p);
    }

    GameLoop.add(this);
}

Explosion.prototype.update = function (time) {
    var self = this;
    var len = this.partials.length;
    for (var i = 0; i < len; i++) {
        this.partials[i].x += this.partials[i].vx * time;
        this.partials[i].y += this.partials[i].vy * time;
        this.partials[i].y += player.vy;
    }
    this.alpha -= 0.1 * time;
    if (this.alpha <= 0.7) {
        this.flasher = setInterval(function () {
            self.flash = (self.flash) ? false : true;
        }, 60);
    }

    if (this.alpha <= 0.1) {
        clearInterval(this.flasher);
        GameLoop.remove(this);
    }
};

Explosion.prototype.draw = function (ctx) {
    if (this.flash) {
        return;
    }
    ctx.globalAlpha = this.alpha;
    var len = this.partials.length;
    for (var i = 0; i < len; i++) {
        var p = this.partials[i];
        ctx.fillStyle = "#FFDB00";
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }
    ctx.globalAlpha = 1;
};