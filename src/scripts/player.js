var player = {
    x: 130,
    y: 300,
    vy: 5,
    speed: 10,
    width: 48,
    height: 30,
    canShoot: true,
    coolDown: 700,
    lives: 2,
    invincible: false,
    drawable: true,
    flash: null,
    score: 0,
    smoothing: 1.2,

    reset: function () {
        this.score = 0;
        this.lives = 2;
        this.coolDown = 700;
        this.speed = 10;
        this.vy = 0;
    },

    update: function (time) {
        var x = this.x;
        //this.x = Input.mX - this.width / 2;
        this.x += (((Input.mX - this.width / 2) - this.x) / this.smoothing) * time;

        if (this.x <= 0) {
            this.x = 0;
        }

        if (this.x + this.width >= cvs.width) {
            this.x = cvs.width - this.width;
        }

        this.vx = this.x - x;

        this.step(time);
    },

    step: function (time) {
        if (this.canShoot && (Input.isDown(Input.click) || Input.isDown(Input.space))) {
            new Bullet(this.x + (this.width / 2), this.y - 20);
            this.canShoot = false;
            setTimeout(function () {
                player.canShoot = true;
            }, this.coolDown);
        }

        this.speed += 0.06 * time;

        this.vy = this.speed * time;

        if (Logic.difficulty < 910) {
            Logic.difficulty += 1.8 * time;
        }

        if (this.coolDown > 150) {
            this.coolDown -= 0.8 * time;
        }

        // loop through walls that we need to do detection
        for (var i = 0; i < Logic.wall.current.length; i++) {
            var wall = Logic.wall.current[i];
            if (this.y < wall.y + wall.height && this.y + this.height > wall.y) {
                if (this.x < wall.width || this.x > (cvs.width - this.width - (wall.x - wall.width))) {
                    this.onHit();
                }
            }
        }

        for (var i = 0; i < Logic.enemies.length; i++) {
            if (Logic.enemies[i].bounding(this)) {
                if (this.onHit()) {
                    new Explosion(player.x, player.y);
                    GameLoop.remove(Logic.enemies[i]);
                    Logic.enemies.splice(i, 1);
                }
            }
        }
    },

    onHit: function () {
        if (!this.invincible) {
            this.invincible = true;
            if (this.lives <= 0) {
                this.vy = 5;
                GameLoop.remove(this);
                this.score = Logic.score;
                Logic.endGame();
            }
            this.flash = setInterval(function () {
                player.drawable = (player.drawable) ? false : true;
            }, 150);
            this.lives--;
            setTimeout(function () {
                clearInterval(player.flash);
                player.invincible = false;
                player.drawable = true;
            }, 2000);
            return true;
        }
        return false;
    },

    draw: function (ctx) {
        if (!this.drawable) {
            return;
        }
        ctx.drawImage(this.img, this.x, this.y, 64, 40);
    }
};