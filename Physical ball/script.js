var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#000'];
var ballGravity = 1;
var balls = [new Ball(canvas.width / 2, 100, 50, 0, 2)];
var mouse = {
	x: 0,
	y: 0,
	speedX: 0,
	speedY: 0,
	oldX: 0,
	oldY: 0,

	update: function() {
		this.speedX = (this.x - this.oldX) / 5;
		this.speedY = (this.y - this.oldY) / 5;

		this.oldX = this.x;
		this.oldY = this.y;
	}
};

function getDistance(x1, y1, x2, y2) {
	const xDist = x2 - x1;
	const yDist = y2 - y1;

	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function getRandom(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min));
}

function rotate(ball, angle) {
    const rotatedVelocities = {
        x: ball.dx * Math.cos(angle) - ball.dy * Math.sin(angle),
        y: ball.dx * Math.sin(angle) + ball.dy * Math.cos(angle)
    };
    return rotatedVelocities;
}

function resolveCollision(ball, otherBall) {
    const xVelocityDiff = ball.dx - otherBall.dx;
    const yVelocityDiff = ball.dy - otherBall.dy;

    const xDist = otherBall.x - ball.x;
    const yDist = otherBall.y - ball.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        const angle = -Math.atan2(otherBall.y - ball.y, otherBall.x - ball.x);

        const m1 = ball.mass;
        const m2 = otherBall.mass;

        const u1 = rotate(ball, angle);
        const u2 = rotate(otherBall, angle);

        const v1 = { dx: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), dy: u1.y };
        const v2 = { dx: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), dy: u2.y };

        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        ball.dx = vFinal1.x;
        ball.dy = vFinal1.y;

        otherBall.dx = vFinal2.x;
        otherBall.dy = vFinal2.y;
    }
}

function Ball(x, y, radius, dx, dy) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.dx = dx;
	this.dy = dy;
	this.frictionY = 0.85;
	this.frictionX = 0.995;
	this.gravity = ballGravity;
	this.mass = 1;
	this.mouseDown = false;
	this.ballColor = colors[getRandom(0, 6)]

	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.ballColor;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fill();
	}

	this.update = function() {
		this.draw();

		for(let i = 0; i < balls.length; i++) {
			if(this === balls[i])
				continue;
			if(getDistance(this.x, this.y, balls[i].x, balls[i].y) - this.radius * 2 < 0) {
				resolveCollision(this, balls[i]);
			}
		}

		if(!this.mouseDown) {
			if(this.x + this.radius + this.dx > canvas.width + 5 || this.x - this.radius + this.dx <= -5) {
				this.dx = -this.dx;
			}

			if(this.y + this.radius + this.dy > canvas.height || this.y - this.radius + this.dy <= -5) {
				this.dy = -this.dy * this.frictionY;
			} else {
				this.dy += this.gravity;
			}

			this.dx *= this.frictionX;
			this.x += this.dx;
			this.y += this.dy;
		}
	}
}

function animate() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(let ball of balls) {
		ball.update();
		ball.gravity = ballGravity;
	}
}

function dragBall() {
	for(let ball of balls) {
		if(mouse.x <= ball.x + ball.radius && mouse.x + ball.radius >= ball.x &&
		   mouse.y <= ball.y + ball.radius && mouse.y + ball.radius >= ball.y) {
			ball.mouseDown = true;
		}
	}
}

function releaseBall() {
	for(let ball of balls) {
		if(ball.mouseDown)
			ball.mouseDown = false;
	}
}

function moveBall() {
	for(let ball of balls) {
		if(ball.mouseDown) {
			if(mouse.x > ball.radius && mouse.x + ball.radius < canvas.width)
				ball.x = mouse.x;									
			if(mouse.y > ball.radius && mouse.y + ball.radius < canvas.height)
				ball.y = mouse.y;

			ball.dx = mouse.speedX;
			ball.dy = mouse.speedY;
		}
	}
}

function positionHandler(e) {
	if(e.clientX && e.clientY) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
		moveBall();
	} else if(e.targetTouches) {
		mouse.x = e.targetTouches[0].clientX;
		mouse.y = e.targetTouches[0].clientY;
		e.preventDefault();

		dragBall();
		moveBall();
	}
}

function addBall(e, x = canvas.width / 2, y = 50) {
	balls.push(new Ball(x, y, 50, 0, 2));
}

function changeGravity() {
	ballGravity = ballGravity == 0 ? 1 : 0;
}

canvas.addEventListener('mousemove', positionHandler, false);
canvas.addEventListener('mousedown', dragBall, false);
canvas.addEventListener('mouseup', releaseBall, false);
canvas.addEventListener('touchstart', positionHandler, false);
canvas.addEventListener('touchend', releaseBall, false);
canvas.addEventListener('touchmove', positionHandler, false);
add.addEventListener('click', addBall);
gravity.addEventListener('click', changeGravity);

window.onkeydown = function(e) {
	if(mouse.x >= 50 && mouse.x <= canvas.width - 50 &&
		mouse.y >= 50 && mouse.y <= canvas.height - 50) {
		switch(e.keyCode) {
			case 32:
				addBall(e, mouse.x, mouse.y);
				break;
			case 71:
				changeGravity();
				break;
		}
	}
}

animate();

setInterval(() => mouse.update(), 1000 / 60);