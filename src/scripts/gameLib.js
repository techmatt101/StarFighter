var cvs, cvsCenter;

function Point(x, y) {
	this.x = x;
	this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
}

function Box(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.vx = 0;
    this.vy = 0;
}

Box.prototype.bounding = function (box) {
    return  this.x < box.x + box.width &&
        this.x + this.width > box.x &&
        this.y < box.y + box.height &&
        this.y + this.height > box.y;
};