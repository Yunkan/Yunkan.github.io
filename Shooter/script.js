var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight;

var sc = document.getElementById("score");
var life = document.getElementById("life");
var score = 0;
var enemySpeed = 2;
var fps = document.getElementById("fps");
var mouse = {
	x: 0,
	y: 0,
};

let frameCount = function _fc(timeStart){
        
        let now = performance.now();
        let duration = now - timeStart;
        
        if(duration < 1000){
            
            _fc.counter++;
            
        } else {
                      
            _fc.fps = _fc.counter;
            _fc.counter = 0;
            timeStart = now; 
            fps.innerHTML = "FPS: <br>" + _fc.fps;

        }
        requestAnimationFrame(() => frameCount(timeStart)); 
    }

frameCount.counter = 0;
frameCount.fps = 0;

frameCount(performance.now())

function getRandom(min, max)
{
	return Math.floor(min + Math.random() * (max + 1 - min));
}

function checkCollision(obj1, obj2)
{
	if(obj1 && obj2)
	{
		if((obj1.x + obj1.w >= obj2.x) && (obj1.x <= obj2.x + obj2.w) &&
			(obj1.y + obj1.h >= obj2.y) && (obj1.y <= obj2.y + obj2.h))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}

function Player(x, y, w, h)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.life = 10;
	this.img = new Image();
	this.img.src = "images/player.png";

	this.draw = function()
	{
		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
	}

	this.damage = function()
	{
		if(!shield)
		{
			this.life--;
			bulletCount = bulletCount > 1 ? --bulletCount : bulletCount;
			life.innerHTML = "Жизни: <br>" + this.life;
			if(this.life <= 0)
				document.location.href = "end.html";
		}
	}
}

var pl = new Player(canvas.width / 2 - 30, canvas.height - 50, 30, 50);


function Bullet(x, y, w, h)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.dy = 10;
	this.img = new Image();
	this.img.src = "images/bullet.png";

	this.draw = function()
	{
		ctx.drawImage(this.img, this.x - this.w / 2, this.y, this.w, this.h);

		this.y -= this.dy;
	}
}

var bullets = [];
var bulletCount = 1;
var bulletSpeed = bulletCount * 100;

function bulletMove()
{
	bulletSpeed = boostSpeed ? bulletCount * 100 / 2 : bulletCount * 100;
	for(var i = 0; i < bulletCount; i++)
	{
		bullets.push(new Bullet(pl.x + pl.w / 2 * (bulletCount - i * 2), pl.y, 10, 20));
	}
	setTimeout(bulletMove, bulletSpeed);
}
bulletMove();

var explCount = 50;
var bulletForExplosionArr = [];

function BulletForExplosion(x, y, w, h)
{
	this.dx = getRandom(-12, 12);
	this.dy = getRandom(-12, 12);
	while(this.dx == 0)
	{
		this.dx = getRandom(-12, 12);
	}
	while(this.dy == 0)
	{
		this.dy = getRandom(-12, 12);
	}
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.img = new Image();
	this.img.src = "images/explosion.png";

	this.draw = function()
	{
		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);

		this.x += this.dx;
		this.y += this.dy;
	}
}


function BulletForEnemy(x, y, w, h)
{
	this.dy = 5;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.img = new Image();
	this.img.src = "images/bulletForEnemy.png";

	this.draw = function()
	{
		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);

		this.y += this.dy;
	}
}


function Enemy(x, y, w, h)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.dy = 2;
	this.dx = (Math.random() - 0.5) * enemySpeed;
	while(this.dy == 0)
	{
		this.dy = getRandom(-12, 12);
	}
	this.life = 5;
	this.path = ["images/enemy.png", "images/enemy1.png", "images/enemy2.png"];
	this.chance = getRandom(0, 100);
	if(this.chance <= 20)
	{
		this.style = this.path[1];
		this.life = 2;
		this.dx = 3;
		this.dy = 4;
	}
	else if(this.chance <= 30)
	{
		this.style = this.path[2];
	}
	else
	{
		this.style = this.path[0];
	}
	this.img = new Image();
	this.img.src = this.style;
	this.bullets = [];

	this.draw = function()
	{
		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);

		this.move();
	}

	this.move = function()
	{
		if(this.style == this.path[1])
		{
			if(this.y >= pl.y - 50 && this.y <= pl.y + 50)
			{
				if(this.x > pl.x)
				{
					this.x += -this.dx;
				}
				else if(this.x < pl.x)
				{
					this.x += this.dx;
				}
			}
			else
			{
				if(this.x >= pl.x - 50 && this.x <= pl.x + 50 && this.y <= pl.y + pl.h)
				{
					this.x += getRandom(0, 100) <= 50 ? -this.dx * 4 : this.dx * 4;
				}
			}
			

			if(this.y > pl.y)
			{
				this.y += -this.dy;
			}
			else if(this.y < pl.y)
			{
				this.y += this.dy;
			}
		}
		else
		{
			if(this.x + this.w > canvas.width || this.x - this.w < 0 || getRandom(0, 10000) <= 75)
			{
				this.dx = -this.dx
			}
			this.x += this.dx;
			this.y += this.dy;
		}
	}

	this.shot = function()
	{
		if(this.style == this.path[2])
		{
			this.bullets.push(new BulletForEnemy(this.x + this.w / 2, this.y + this.h, 10, 20));
			
			setTimeout(e => this.shot(e), getRandom(800, 1000));
		}
	}

	this.damage = function(dmg, j)
	{
		this.life -= dmg;

		if(this.life <= 0)
		{
			enemies.splice(j, 1);
			score++;
			sc.innerHTML = "Очки: <br>" + score;
		}
	}

	this.shot();
}

var enemies = [new Enemy(getRandom(40, canvas.width - 40), -40, 40, 40)];
var spawnTime = 300;

function spawnEnemy()
{
	enemies.push(new Enemy(getRandom(40, canvas.width - 40), -40, 40, 40));
	setTimeout(spawnEnemy, getRandom(spawnTime, spawnTime + 100));
}
spawnEnemy();


function Bonus(x, y)
{
	this.x = 350;
	this.y = y;
	this.w = 40;
	this.h = 40;
	this.dy = 5;
	this.life = 200;
	this.take = false;
	this.path = ["images/boost.png", "images/heal.png", "images/explosion.png", "images/shield.png", "images/doubleShot.png"];
	this.style = this.path[getRandom(0, 4)];
	this.img = new Image();
	this.img.src = this.style;

	this.draw = function()
	{
		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);

		this.y += this.dy;
	}

	this.taken = function()
	{
		this.take = true;
		if(this.style == this.path[0])
		{
			boostSpeed = true;
		}
		else if(this.style == this.path[1])
		{
			pl.life = 10;
			life.innerHTML = "Жизни: <br>" + pl.life;
		}
		else if(this.style == this.path[2])
		{
			for(let i = 0; i < explCount; i++)
			{
				bulletForExplosionArr.push(new BulletForExplosion(pl.x + pl.w / 2, pl.y + pl.h / 2, 25, 25));
			}
		}
		else if(this.style == this.path[3])
		{
			shield = true;
		}
		else if(this.style == this.path[4])
		{
			bulletCount++;
		}
	}

	this.damage = function()
	{
		this.life--;

		if(this.life <= 0)
		{
			this.take = false;
			issetBonus = false;
			boostSpeed = false;
			bulletSpeed = bulletCount * 100;
			shield = false;
			bulletForExplosionArr.splice(0, bulletForExplosionArr.length);
		}
	}
}

var bonus;
var issetBonus = false;
var shield = false;
var boostSpeed = false;

function createBonus()
{
	bonus = new Bonus(getRandom(25, canvas.width - 25), -25);
    issetBonus = true;
    setTimeout(createBonus, getRandom(10000, 20000));
}
createBonus();


setInterval(
	function()
	{
		if(spawnTime > 10) spawnTime--;
		enemySpeed += 0.5;
	},
5000);

function animate()
{
	canvas.width = window.innerWidth / 2;
	canvas.height = window.innerHeight;
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	pl.draw();

	for(let i in bullets)
	{
		bullets[i].draw();

		if(bullets[i].y + bullets[i].h < 0)
			bullets.splice(i, 1);

		for(let j in enemies)
		{
			if(checkCollision(bullets[i], enemies[j]))
			{
				enemies[j].damage(1, j);
				bullets.splice(i, 1);
			}
		}
	}

	for(let i in enemies)
	{
		enemies[i].draw();

		if(checkCollision(enemies[i], pl))
		{
			pl.damage();
			enemies.splice(i, 1);
		}

		for(let j in enemies[i].bullets)
		{
			enemies[i].bullets[j].draw();
			if(checkCollision(enemies[i].bullets[j], pl))
			{
				enemies[i].bullets.splice(j, 1);
				pl.damage();
			}
		}
	}

	if(issetBonus)
	{
		if(!bonus.take)
		{
			bonus.draw();

			if(checkCollision(bonus, pl))
			{
				bonus.taken();
			}
		}

		if(bonus.take)
		{
			for(let i in bulletForExplosionArr)
			{
				bulletForExplosionArr[i].draw();

				for(let j in enemies)
				{
					if(checkCollision(bulletForExplosionArr[i], enemies[j]))
					{
						enemies[j].damage(enemies[j].life, j);
						bulletForExplosionArr.splice(i, 1);
					}
				}
			}

			if(shield)
			{
				ctx.beginPath();
				ctx.strokeStyle = "#9ab7f3";
				ctx.lineWidth = 5;
				ctx.arc(pl.x + pl.w / 2, pl.y + pl.h / 2, pl.h, 0, Math.PI * 2, false);
				ctx.stroke();
			}

			bonus.damage();
		}
	}
}

function playerMove()
{
	if(canvas.width > pl.x - pl.w && pl.x + pl.w >= 0)
	{
		pl.x = mouse.x - pl.w / 2;
	}
	if(canvas.height > pl.y - pl.h && pl.y + pl.h >= 0)
	{
		pl.y = mouse.y - pl.h / 2;
	}
}

function positionHandler(e)
{
	if(e.offsetX && e.clientY)
	{
		mouse.x = e.offsetX;
		mouse.y = e.clientY;
		playerMove();
	}
	else if(e.targetTouches)
	{
		mouse.x = e.targetTouches[0].clientX - canvas.offsetLeft / 2;
		mouse.y = e.targetTouches[0].clientY;
		e.preventDefault();
		playerMove();
	}
}

canvas.addEventListener('mousemove', positionHandler, false);
canvas.addEventListener('touchstart', positionHandler, false);
canvas.addEventListener('touchmove', positionHandler, false); 

animate();