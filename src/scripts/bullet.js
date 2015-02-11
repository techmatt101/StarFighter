function Bullet (x, y) {
    Box.call(this, 0, 0, 10, 20);

	this.speed = 25;
	this.x = x - this.width / 2;
	this.y = y;
	GameLoop.add(this);
}

Bullet.prototype = Object.create(Box.prototype);

Bullet.prototype.update = function (time) {
    this.y -= this.speed * time;

    if (this.y + this.width < 0) {
        GameLoop.remove(this);
    }

    // loop through walls that we need to do detection
    for (var i = 0; i < Logic.wall.current.length; i++) {
        var wall = Logic.wall.current[i];
        if (this.y < wall.y + wall.height && this.y + this.height > wall.y) {
            if (this.x < wall.width || this.x > (cvs.width - this.width - (wall.x - wall.width))) {
                GameLoop.remove(this);
            }
        }
    }

    for (var i = 0; i < Logic.enemies.length; i++) {
        if (this.bounding(Logic.enemies[i])) {
            GameLoop.remove(Logic.enemies[i]);
            GameLoop.remove(this);
            new Explosion(this.x, this.y);
            Logic.enemies.splice(i, 1);
            Logic.score += 100;
        }
    }

};

Bullet.prototype.draw = function (ctx) {
    ctx.fillStyle = "#FFDB00";
    ctx.fillRect(this.x, this.y, this.width, this.height);
};