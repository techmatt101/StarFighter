function Walls () {
	this.counter = 0;
	this.currentLength = 0;
	this.growLength = true;
	this.currentStep = 30;
	this.heightIncreaseInterval = 50;    // fudge
	this.current = [
		{
			x: 0,
			y: -20,
			width: 0,
			height: 20,
			color: "#000"
		}
	];
	this.separation = 20;                //fudge
	this.height = 20;
	this.color = 5;
	this.parallax = 1;
	this.play = true;
}

Walls.prototype.setColor = function (color) {
    this.color = color;
};

Walls.prototype.update = function (time) {

    if(this.growLength && this.currentLength < 150) {
        this.currentLength += 0.7 * time;
    } else {
        this.growLength = false;
    }

    if(!this.growLength && this.currentLength > 50) {
        this.currentLength -= 0.7 * time;
    } else {
        this.growLength = true;
    }

    if (player.gameOver && Input.isDown(Input.Restart)) {
        var self = this;
        this.play = false;
        player.gameOver = false;
        Logic.difficulty = -2000;
        for (var i = 0; i < Logic.enemies.length; i++) {
            GameLoop.remove(Logic.enemies[i]);
            Logic.enemies.splice(i, 1);
        }
        setTimeout(function () {
            self.play = true;
            self.current = [
                {
                    x: 160,
                    y: -20,
                    width: 50,
                    height: 20,
                    color: "#000"
                }
            ];
            Logic.score = 0;
            Logic.difficulty = 40;
            player.reset();
            GameLoop.add(player);

        }, 2000)
    }

    for (var i = 0; i < this.current.length; i++) {
        this.current[i].y += player.vy * this.parallax;
        if (this.current[i].y > this.current[i].height + cvs.height) { // condition : if the last wall in the array has disappeared off screen, remove it
            this.current.splice(i, 1);
        }
    }

    // get the global draw context
    //var draw = this.drawContext;
    // condition : if the separation (between walls) has been reached, create a new wall
    if (this.play) {
        //if (this.counter++ >= ~~(this.separation / (player.vy * this.parallax)) - 1) {
        var block = this.current[this.current.length - 1];

        for (var i = 0; i < block.y; i += this.height) {

            // get previous wall height
            var previousLength = block.width;

            // random decision, whether to increase or decrease the height (either 0 or 1)
            var plusMinus = Math.round(Math.random());

            // throw in the occasional bigger jump in wall positioning...
            var bigOne = Math.round(Math.random() * 10);

            // set variable that will contain new height
            var newLength;

            // condition : calculate the new height
            if (bigOne == 10) {
                newLength = this.currentLength / 2;
            } else if (plusMinus == 1) {
                newLength = previousLength + ~~(Math.random() * this.currentStep);
            } else {
                newLength = previousLength - ~~(Math.random() * this.currentStep);
            }

            // condition : stop the height going too...high
            if (newLength > this.currentLength) {
                newLength = this.currentLength - this.currentStep;
            }

            // condition : stop the height going too...low
            if (newLength < 0) {
                newLength = this.currentStep;
            }

            var blockColor
            if(Logic.score > 10000 && this.color == 5) {
                blockColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
            } else {
                var hex2 = (~~(Math.random() * 9) + 0).toString();
                blockColor = "#" + this.color + hex2 + this.color + hex2 + this.color + hex2;
            }


            var newWall = { // generate values for the new wall
                x: this.currentLength,
                y: this.current[this.current.length - 1].y - this.height,
                width: newLength,
                height: this.height,
                color: blockColor
            };

            // add wall to the array
            this.current.push(newWall);

            // reset wall separation counter
            this.counter = 0;
        }
    }
};

Walls.prototype.draw = function (ctx) {
    // draw every wall in the array
    for (var i = 0; i < this.current.length; i++) {
        var block = this.current[i];

        // draw ceiling
        ctx.fillStyle = block.color;
        ctx.fillRect(0, block.y, block.width, block.height);
        ctx.fill();

        // draw floor
        ctx.fillRect(cvs.width - (this.current[i].x - this.current[i].width), this.current[i].y, this.current[i].x - this.current[i].width, this.current[i].height);
        ctx.fill();
    }

    ctx.fillStyle = "#FFDB00";
    if (player.gameOver) {
        ctx.font = "52px visitor";
        ctx.fillText("GAME OVER", 20, 100);
        ctx.fillStyle = "#fff";
        ctx.font = "38px visitor";
        ctx.fillText("Score: " + player.score, 20, 130);
        ctx.font = "20px visitor";
        ctx.fillText("Press r to replay", 20, 160);
    } else {
        ctx.font = "16px visitor";
        ctx.fillStyle = "#fff";
        ctx.fillText("Score: " + Logic.score, 15, 20);
        ctx.font = "16px visitor";
        ctx.fillStyle = "#fff";
        var lives = String.fromCharCode(10084);
        for (var i = 0; i < player.lives; i++) {
            lives += String.fromCharCode(10084);
        }
        ctx.fillText("Lives:", cvs.width - 115, 20);
        ctx.fillText(lives, cvs.width - 60, 21);
    }
};