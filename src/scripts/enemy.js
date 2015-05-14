function Enemy (x) {
    Box.call(this, x, -15, 15, 15);
    GameLoop.add(this);

	this.vx = ~~(Math.random() * 4) - 2;
	this.vy = ~~(Math.random() * 4) - 2;
	this.speed = ~~(Math.random() * 5) / 10 + 1;
	this.color = "#FFDB00";
}

Enemy.prototype = Object.create(Box.prototype);

Enemy.prototype.update = function (time) {
    this.y += Game.camera.y;
    this.x += this.vx * this.speed * time;
    this.y += this.vy * this.speed * time;

    if (this.y > cvs.height) {
        GameLoop.remove(this);
    }
};

Enemy.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
};