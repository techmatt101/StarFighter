function Enemy (x) {
    Box.call(this, 0, -20, 20, 20);

	this.x = x;
	this.vx = ~~(Math.random() * 4) - 2;
	this.vy = ~~(Math.random() * 4) - 2;
	this.color = "#FFDB00";
	GameLoop.add(this);
}

Enemy.prototype = Object.create(Box.prototype);

Enemy.prototype.update = function (time) {
    this.y += player.vy;
    this.x += this.vx * time;
    this.y += this.vy * time;

    if (this.y > cvs.height) {
        GameLoop.remove(this);
    }
};

Enemy.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
};