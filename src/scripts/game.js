window.addEventListener('load', gameSetup, false);

function gameSetup() {
    cvs = document.getElementById('game');
    cvsCenter = new Point(this.cvs.width / 2, this.cvs.height / 2);
    var ctx = cvs.getContext("2d");

    Input.init();
    Game.init();
    GameLoop.start(ctx);
}

var Game = {
    objects: [],
    enemies: [],
    walls: null,
    player: null,
    ui: null,
    difficulty: 0,
    score: 0,
    isPlaying: false,
    speed: 0,
    camera: { x: 0, y: 5 },
    loading: true,
    firstStart: true,

    init: function() {
        this.ui = new UI();
        this.walls = new Walls();
        var bgWalls = new Walls();
        bgWalls.setColor(2);
        bgWalls.parallax = 0.9;

        GameLoop.add(this);
        GameLoop.add(this.walls);
        GameLoop.addBG(bgWalls);

        Leaderboard.showScores();
        setInterval(function () {
            if(Game.isPlaying) Game.score += 10;
        }, 500);

        this.load();
        cvs.addEventListener('click', function() {
            console.log(Game.loading);
            if(!Game.isPlaying && !Game.loading) Game.startGame();
        });
    },

    load: function() {
        var self = this;
        this.loading = true;
        setTimeout(function() {
            self.loading = false;
        }, 1000);
    },

    takeLife: function() {
        this.player.lives--;
        if (this.player.lives < 0) {
            this.endGame();
        }
    },

    killAllEnemies: function() {
        for (var i = 0; i < this.enemies.length; i++) {
            new Explosion(this.enemies[i].x, this.enemies[i].y);
            GameLoop.remove(this.enemies[i]);
        }
        this.enemies = [];
    },

    spawner: function() {
        if(!this.isPlaying) return;
        var space = (((this.walls.currentLength / 100) - 1) / 5) + 1;
        var ranTime = ~~(Math.random() * (1200 - this.difficulty / space) + (800 - this.difficulty / space));
        var ranPos = ~~(Math.random() * cvs.width);
        this.enemies.push(new Enemy(ranPos));
        setTimeout(this.spawner.bind(this), ranTime);
    },

    update: function(time) {
        if(!this.isPlaying) return;
        this.speed += 0.03 * time;
        this.camera.y = this.speed * time;

        if (this.difficulty < 750) {
            this.difficulty += 1.6 * time;
        }
    },

    draw: function() {
    },

    startGame: function() {
        this.player = new Player();
        Leaderboard.hide();
        this.score = 0;
        this.speed = 10;
        this.difficulty = 100;
        this.isPlaying = true;
        this.spawner();
    },

    endGame: function() {
        this.firstStart = false;
        this.isPlaying = false;
        this.camera.y = 5;
        GameLoop.remove(this.player);
        this.killAllEnemies();
        Leaderboard.updateScore(this.score, function() {
            Leaderboard.showScores();
        });
        this.load();
    }
};