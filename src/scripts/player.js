function Player () {
    Box.call(this, cvs.width / 2, 320, 48, 30);
    GameLoop.add(this);

    this.lives = 3;
    this.coolDown = 800;
    this.secondShoot = false;
    this.onCoolDown = false;
    this.drawable = true;
    this.invincible = false;
    this.flash = null;
    this.smoothing = 1.3;
    this.img = new Image();

    this.img.src = 'images/spaceship.gif';
    this.temporaryInvincible();
}

Player.prototype.update = function(time) {
    var self = this;
    this.x += (((Input.mX - this.width / 2) - this.x) / this.smoothing) * time;

    // boundary checking
    if (this.x <= 0) {
        this.x = 0;
    }
    if (this.x + this.width >= cvs.width) {
        this.x = cvs.width - this.width;
    }

    if (this.coolDown > 200) {
        this.coolDown -= 0.5 * time;
    }

    if (!this.onCoolDown && (Input.isDown(Input.click) || Input.isDown(Input.space))) {
        new Bullet(this.x + (this.width / 2), this.y - 20);
        this.secondShoot = !this.secondShoot;
        this.onCoolDown = true;
        setTimeout(function () {
            self.onCoolDown = false;
        }, (this.secondShoot) ? this.coolDown : this.coolDown / 3);
    }

    // Collision detection
    for (var i = 0; i < Game.walls.current.length; i++) {
        var wall = Game.walls.current[i];
        if (this.y < wall.y + wall.height && this.y + this.height > wall.y) {
            if (this.x < wall.width || this.x > (cvs.width - this.width - (wall.x - wall.width))) {
                this.onHit();
            }
        }
    }

    for (var i = 0; i < Game.enemies.length; i++) {
        if (Game.enemies[i].bounding(this)) {
            if (this.onHit()) {
                new Explosion(this.x, this.y);
                GameLoop.remove(Game.enemies[i]);
                Game.enemies.splice(i, 1);
            }
        }
    }
};

Player.prototype.onHit = function() {
    if (this.invincible) return false;

    Game.takeLife();
    if(this.lives < 0) return true;
    this.temporaryInvincible();

    return true;
};

Player.prototype.temporaryInvincible = function() {
    var self = this;
    this.invincible = true;
    this.flash = setInterval(function () {
        self.drawable = (self.drawable) ? false : true;
    }, 150);

    setTimeout(function () {
        clearInterval(self.flash);
        self.invincible = false;
        self.drawable = true;
    }, 2000);
};

Player.prototype.draw = function(ctx) {
    if(this.drawable) ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
};