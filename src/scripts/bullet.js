function Bullet (x, y) {
    Box.call(this, x, y, 10, 20);
    GameLoop.add(this);

    this.speed = 40;
    this.x = x - this.width / 2;
}

Bullet.prototype = Object.create(Box.prototype);

Bullet.prototype.update = function (time) {
    this.y -= this.speed * time;

    if (this.y + this.width < 0) {
        GameLoop.remove(this);
    }

    // loop through walls that we need to do detection
    for (var i = 0; i < Game.walls.current.length; i++) {
        var wall = Game.walls.current[i];
        if (this.y < wall.y + wall.height && this.y + this.height > wall.y) {
            if (this.x < wall.width || this.x > (cvs.width - this.width - (wall.x - wall.width))) {
                GameLoop.remove(this);
            }
        }
    }

    for (var i = 0; i < Game.enemies.length; i++) {
        if (this.bounding(Game.enemies[i])) {
            GameLoop.remove(Game.enemies[i]);
            GameLoop.remove(this);
            new Explosion(this.x, this.y);
            Game.enemies.splice(i, 1);
            Game.score += 100;
        }
    }
};

Bullet.prototype.draw = function (ctx) {
    ctx.fillStyle = "#FFDB00";
    ctx.fillRect(this.x, this.y, this.width, this.height);
};