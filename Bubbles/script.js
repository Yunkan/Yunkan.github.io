function getRandom(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min));
}

function getDistance(x1, y1, x2, y2) {
	const xDist = x2 - x1;
	const yDist = y2 - y1;

	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function rotate(obj, angle) {
    const rotatedVelocities = {
        x: obj.dx * Math.cos(angle) - obj.dy * Math.sin(angle),
        y: obj.dx * Math.sin(angle) + obj.dy * Math.cos(angle)
    };
    return rotatedVelocities;
}

function resolveCollision(obj1, obj2) {
    const xVelocityDiff = obj1.dx - obj2.dx;
    const yVelocityDiff = obj1.dy - obj2.dy;

    const xDist = obj2.x - obj1.x;
    const yDist = obj2.y - obj1.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        const angle = -Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);

        const m1 = obj1.mass;
        const m2 = obj2.mass;

        const u1 = rotate(obj1, angle);
        const u2 = rotate(obj2, angle);

        const v1 = { dx: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), dy: u1.y };
        const v2 = { dx: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), dy: u2.y };

        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        obj1.dx = vFinal1.x;
        obj1.dy = vFinal1.y;

        obj2.dx = vFinal2.x;
        obj2.dy = vFinal2.y;
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


function Bubble(x, y, dx, dy, r) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.r = r;
	this.mass = 1;
	this.gravity = 0;
	this.miniBubbles = [];
	this.miniBubblesAmount = 50;
}

Bubble.prototype.draw = function () {
	ctx.beginPath();
	ctx.fillStyle = "#fff";
	ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
	ctx.fill();

	this.move();
};

Bubble.prototype.move = function() {
	if(this.x + this.r > canvas.width || this.x - this.r < 0) {
		this.dx = -this.dx;
	}

	if(this.y + this.r > canvas.height || this.y - this.r < 0) {
		this.dy = -this.dy;
	}

	this.x += this.dx;
	this.y += this.dy;

	for(let i = 0; i < bubbles.length; i++) {
		if(this === bubbles[i])
			continue;
		if(getDistance(this.x, this.y, bubbles[i].x, bubbles[i].y) - this.r * 2 < 0) {
			resolveCollision(this, bubbles[i]);
		}
	}
}

Bubble.prototype.die = function() {
	for(let i = 0; i < this.miniBubblesAmount; i++) {
		this.miniBubbles.push(new MiniBubble(this.x, this.y, 2, i, this));
	}
	this.x = getRandom(25, canvas.width - 25);
	this.y = getRandom(25, canvas.height - 25);
}

function MiniBubble(x, y, r, i, owner) {
	this.gravity = 0.1;
	this.dx = getRandom(-10, 10);
	this.dy = getRandom(-10, 10);
	this.x = x;
	this.y = y;
	this.r = r;
	this.i = i;
	this.owner = owner;
	this.timeToLive = 100;
	this.opacity = 1;
}

MiniBubble.prototype.draw = function() {
	ctx.beginPath();
	ctx.fillStyle = `rgba(225, 225, 225, ${this.opacity})`;
	ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
	ctx.fill();

	this.move();
}

MiniBubble.prototype.move = function() {
	this.dy += this.gravity;

	this.x += this.dx;
	this.y += this.dy;
	this.timeToLive--;
	this.opacity -= 1 / this.timeToLive;
	if(this.timeToLive <= 0) {
		this.owner.miniBubbles.splice(this.i, 1);
	}
}

function Wave(x, y, r, i) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.timeToLive = 100;
	this.opacity = 1;
	this.i = i;
}

Wave.prototype.draw = function() {
	ctx.beginPath();
	ctx.strokeStyle = `rgba(225, 225, 225, ${this.opacity})`;
	ctx.lineWidth = 2;
	ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
	ctx.stroke();

	this.r += 2;
	this.timeToLive--;
	this.opacity -= 1 / this.timeToLive;
	waves = waves.filter(wave => !(wave.timeToLive <= 0));
}

const bubbles = [];
const bubblesAmount = 50;
let waves = [];
let bubbleDie = false;

for(let i = 0; i < bubblesAmount; i++) {
	const x = getRandom(25, canvas.width - 25);
	const y = getRandom(25, canvas.height - 25);
	const r = getRandom(15, 20);
	const dx = Math.random() - 0.5;
	const dy = Math.random() - 0.5;
	bubbles.push(new Bubble(x, y, dx, dy, r));
}

canvas.onmousedown = function(e) {
	bubbles.forEach(bubble => {
		if(e.pageX <= bubble.x + bubble.r && e.pageX + bubble.r >= bubble.x &&
		   e.pageY <= bubble.y + bubble.r && e.pageY + bubble.r >= bubble.y) {
			bubble.die();
			bubbleDie = true;
		}
	});
	if(!bubbleDie)
		waves.push(new Wave(e.pageX, e.pageY, 10));
	bubbleDie = false;
}

function animate() {
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	bubbles.forEach(bubble => {
		bubble.draw();
		bubble.miniBubbles.forEach(miniBubble => miniBubble.draw());
	});
	waves.forEach(wave => wave.draw());
}

animate();
