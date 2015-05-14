function UI() {
    GameLoop.add(this);
}

UI.prototype.update = function(time) {

};

UI.prototype.draw = function(ctx) {
    ctx.fillStyle = "#FFDB00";
    if (Game.isPlaying) {
        ctx.font = "16px visitor";
        ctx.fillStyle = "#fff";
        ctx.fillText("Score: " + Game.score, 15, 20);
        ctx.font = "16px visitor";

        var lives = '';
        ctx.fillStyle = "#000";
        for (var i = 0; i < 3; i++) {
            lives += String.fromCharCode(10084);
        }
        ctx.fillText(lives, cvs.width - 60, 21);

        ctx.fillStyle = "#fff";
        lives = '';
        for (var i = 0; i < Game.player.lives; i++) {
            lives += String.fromCharCode(10084);
        }
        ctx.fillText("Lives:", cvs.width - 115, 20);
        ctx.fillText(lives, cvs.width - 60, 21);
    } else if(Game.firstStart) {
        ctx.fillStyle = "#fff";
        ctx.font = "38px visitor";
        ctx.fillText("Leaderboard", 20, 130);
        ctx.font = "20px visitor";
        ctx.fillText("Click to play", 20, 100);
    } else {
        ctx.font = "52px visitor";
        ctx.fillText("GAME OVER", 20, 80);
        ctx.fillStyle = "#fff";
        ctx.font = "38px visitor";
        ctx.fillText("Score: " + Game.score, 20, 110);
        ctx.font = "20px visitor";
        ctx.fillText("Click to replay", 20, 140);
    }
};