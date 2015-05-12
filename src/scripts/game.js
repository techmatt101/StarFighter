window.addEventListener('load', gameSetup, false);

function gameSetup() {
    cvs = document.getElementById('game');
    cvsCenter = new Point(this.cvs.width / 2, this.cvs.height / 2);
    var ctx = cvs.getContext("2d");

    Input.init();
    GameLoop.start(ctx);
    Logic.init();
    Logic.endGame();
}

var Logic = {
    objects: [],
    gameData: {},
    wall: {},
    enemies: [],
    difficulty: 40,
    score: 0,
    gameStarted : true,
    gameOver: true,

    init: function () {
        var img = new Image();
        img.src = 'images/spaceship.gif';
        player.img = img;
        this.wall = new Walls;
        var bgWalls = new Walls;
        bgWalls.setColor(2);
        bgWalls.parallax = 0.9;
        GameLoop.add(this.wall);
        GameLoop.addBG(bgWalls);
        setTimeout(this.Spawner, 1000);
        setInterval(function () {
            if(!Logic.gameOver)
                Logic.score += 10;
        }, 200);
    },

    Spawner: function () {
        var space = (((Logic.wall.currentLength / 100) - 1) / 5) + 1;
        var ranTime = ~~(Math.random() * (1200 - Logic.difficulty / space) + (800 - Logic.difficulty / space));
        var ranPos = ~~(Math.random() * cvs.width);
        Logic.enemies.push(new Enemy(ranPos));
        setTimeout(Logic.Spawner, ranTime);
    },

    startGame: function() {
        Logic.gameOver = false;
        Leaderboard.hide();
        this.gameStarted = false;
    },

    endGame: function() {
        Logic.gameOver = true;
        Leaderboard.updateScore(Logic.score, function() {
            Leaderboard.showScores();
        });
    }
};