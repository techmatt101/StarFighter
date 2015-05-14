function Walls() {
    this.currentLength = 0;
    this.growLength = true;
    this.currentStep = 30;
    this.current = [{
        x: 0,
        y: -20,
        width: 0,
        height: 20,
        color: "#000"
    }];
    this.height = 20;
    this.color = 5;
    this.parallax = 1;
    this.count = 0;
}

Walls.prototype.setColor = function(color) {
    this.color = color;
};

Walls.prototype.update = function(time) {

    if (this.growLength && this.currentLength < 150) {
        this.currentLength += 0.7 * time;
    } else {
        this.growLength = false;
    }

    if (!this.growLength && this.currentLength > 50) {
        this.currentLength -= 0.7 * time;
    } else {
        this.growLength = true;
    }

    for (var i = 0; i < this.current.length; i++) {
        this.current[i].y += Game.camera.y * this.parallax;
        if (this.current[i].y > this.current[i].height + cvs.height) { // condition : if the last wall in the array has disappeared off screen, remove it
            this.current.splice(i, 1);
        }
    }

    // get the global draw context
    // condition : if the separation (between walls) has been reached, create a new wall
    var block = this.current[this.current.length - 1];

    for (var i = 0; i < block.y; i += this.height) {
        this.count++;
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

        var blockColor;
        if (Game.score > 10000 && this.color == 5) {
            blockColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        } else if(this.count % 100 === 0 && this.color == 5) {
            blockColor = '#f5e460';
        } else {
            var hex2 = (~~(Math.random() * 9)).toString();
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
    }
};

Walls.prototype.draw = function(ctx) {
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
};