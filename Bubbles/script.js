function getRandom(min, max)
{
	return Math.floor(min + Math.random() * (max + 1 - min));
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


function Circle(x, y, dx, dy, r)
{
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.r = r;

	this.draw = function()
	{
		ctx.beginPath();
		ctx.fillStyle = "#fff";
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
		ctx.fill();
	}

	this.update = function()
	{
		if(this.x + this.r > canvas.width || this.x - this.r < 0)
		{
			this.dx = -this.dx;
		}

		if(this.y + this.r > canvas.height || this.y - this.r < 0)
		{
			this.dy = -this.dy;
		}

		this.x += this.dx;
		this.y += this.dy;


		this.draw();
	}
}

function MiniCircles(x, y, r)
{
	Circle.call(this, x, y, r);

	this.gravity = 0.1;
	this.dx = getRandom(-10, 10);
	this.dy = getRandom(-10, 10);
	this.x = x;
	this.y = y;
	this.r = r;
	this.timeToLive = 100;
	this.opacity = 1;

	this.draw = function()
	{
		ctx.beginPath();
		ctx.fillStyle = "rgba(225, 225, 225, " + this.opacity + ")";
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
		ctx.fill();
	}

	this.update = function()
	{
		this.dy += this.gravity;

		this.x += this.dx;
		this.y += this.dy;
		this.timeToLive--;
		this.opacity -= 1 / this.timeToLive;


		this.draw();
	}
}

var circleArr = [];
var miniCircles = [];
var circleCount = 50;
var miniCircleCount = 50;

for(var i = 0; i < circleCount; i++)
{
	var x = getRandom(25, canvas.width - 25);
	var y = getRandom(25, canvas.height - 25);
	var r = 15;
	var dx = Math.random() - 0.5;
	var dy = Math.random() - 0.5;
	circleArr.push(new Circle(x, y, dx, dy, r));
}

canvas.onmousedown = function(e)
{
	for(var i = 0; i < circleCount; i++)
	{
		if(e.pageX <= circleArr[i].x + circleArr[i].r && e.pageX + circleArr[i].r >= circleArr[i].x &&
		   e.pageY <= circleArr[i].y + circleArr[i].r && e.pageY + circleArr[i].r >= circleArr[i].y)
		{
			for(var j = 0; j < miniCircleCount; j++)
			{
				miniCircles.push(new MiniCircles(circleArr[i].x, circleArr[i].y, 2));
			}
			circleArr[i].x = getRandom(25, canvas.width - 25);
			circleArr[i].y = getRandom(25, canvas.height - 25);
		}
	}
}

function animate()
{
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i < circleArr.length; i++)
	{
		circleArr[i].update();
	}
	for(var i = 0; i < miniCircles.length; i++)
	{
		miniCircles[i].update();

		if(miniCircles[i].timeToLive == 0)
		{
			miniCircles.splice(i, 1);;
		}
	}
}

animate();