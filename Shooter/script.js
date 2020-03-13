var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight;

var sc = document.getElementById("score");
var life = document.getElementById("life");
var score = 0;
var enemySpeed = 2;
var fps = document.getElementById("fps");

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
	this.life = 3;
	this.path = ["images/enemy.png", "images/enemy1.png", "images/enemy2.png"];
	this.chance = getRandom(0, 100);
	if(this.chance <= 20)
	{
		this.style = this.path[1];
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
			if(this.x >= pl.x)
			{
				this.x -= 3;
			}
			else
			{
				this.x += 3;
			}

			if(this.y >= pl.y)
			{
				this.y -= 4;
			}
			else
			{
				this.y += 4;
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
			
			setTimeout(e => this.shot(e), 1000);
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
	this.taken = false;
	this.path = ["images/boost.png", "images/heal.png", "images/explosion.png", "images/shield.png", "images/doubleShot.png"];
	this.style = this.path[getRandom(0, 4)];
	this.img = new Image();
	this.img.src = this.style;

	this.draw = function()
	{
		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);

		this.y += this.dy;
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
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	pl.draw();
	bulletLen = bullets.length;

	while(bulletLen--)
	{
		bullets[bulletLen].draw();

		if(bullets[bulletLen].y + bullets[bulletLen].h < 0)
		{
			bullets.splice(bulletLen, 1);
		}
	}
	enemiesLen = enemies.length;
	while(enemiesLen--)
	{
		enemies[enemiesLen].draw();

		enemiesBulletLen = enemies[enemiesLen].bullets.length;
		while(enemiesBulletLen--)
		{
			enemies[enemiesLen].bullets[enemiesBulletLen].draw();

			if(enemies[enemiesLen].bullets[enemiesBulletLen].y - enemies[enemiesLen].bullets[enemiesBulletLen].h > canvas.height)
			{
				enemies[enemiesLen].bullets.splice(enemiesBulletLen, 1);
			}

			if(checkCollision(enemies[enemiesLen].bullets[enemiesBulletLen], pl))
			{
				if(!shield)
				{
					pl.life--;
					bulletCount = bulletCount > 1 ? --bulletCount : bulletCount;
					life.innerHTML = "Жизни: <br>" + pl.life;
					if(pl.life <= 0)
					{
						document.location.href = "end.html";
					}
				}
				
				enemies[enemiesLen].bullets.splice(enemiesBulletLen, 1);
			}
		}

		bulletLen = bullets.length;

		while(bulletLen--)
		{
			if(checkCollision(enemies[enemiesLen], bullets[bulletLen]))
			{
				enemies[enemiesLen].life--;
				bullets.splice(bulletLen, 1);
			}
		}

		if(checkCollision(enemies[enemiesLen], pl))
		{
			if(!shield)
			{
				pl.life--;
				bulletCount = bulletCount > 1 ? --bulletCount : bulletCount;
				life.innerHTML = "Жизни: <br>" + pl.life;
				if(pl.life <= 0)
				{
					document.location.href = "end.html";
				}
			}
			
			enemies.splice(enemiesLen, 1);		
		}

		if(enemies[enemiesLen] && enemies[enemiesLen].life <= 0)
		{
			enemies.splice(enemiesLen, 1);
			score++;
			sc.innerHTML = "Очки: <br>" + score;
		}

		if(enemies[enemiesLen] && enemies[enemiesLen] && enemies[enemiesLen].y - enemies[enemiesLen].h > canvas.height)
		{
			enemies.splice(enemiesLen, 1);
		}
	}

	if(issetBonus)
	{
		if(!bonus.taken)
		{
			bonus.draw();

			if(checkCollision(bonus, pl))
			{
				if(bonus.style == "images/boost.png")
				{
					boostSpeed = true;
				}
				else if(bonus.style == "images/heal.png")
				{
					pl.life = 10;
					life.innerHTML = "Жизни: <br>" + pl.life;
				}
				else if(bonus.style == "images/explosion.png")
				{
					for(var j = 0; j < explCount; j++)
					{
						bulletForExplosionArr.push(new BulletForExplosion(pl.x + pl.w / 2, pl.y + pl.h / 2, 25, 25));
					}
				}
				else if(bonus.style == 'images/shield.png')
				{
					shield = true;
				}
				else if(bonus.style == "images/doubleShot.png")
				{
					bulletCount++;
				}

				bonus.taken = true;
			}
		}

		if(bonus.taken)
		{
			bulletLen = bulletForExplosionArr.length;
			while(bulletLen--)
			{
				bulletForExplosionArr[bulletLen].draw();
				enemiesLen = enemies.length;
				while(enemiesLen-- && enemies[enemiesLen])
				{
					if(checkCollision(enemies[enemiesLen], bulletForExplosionArr[bulletLen]))
					{
						enemies[enemiesLen].life -= enemies[enemiesLen].life;
						bulletForExplosionArr.splice(bulletLen, 1);
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

			bonus.life--;

			if(bonus.life <= 0)
			{
				bonus.taken = false;
				issetBonus = false;
				boostSpeed = false;
				bulletSpeed = bulletCount * 100;
				shield = false;
				bulletForExplosionArr.splice(0, bulletForExplosionArr.length);
			}
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

var mouse = {
	x: 0,
	y: 0,
};

function positionHandler(e)
{
	if (e.offsetX && e.clientY)
	{
		mouse.x = e.offsetX;
		mouse.y = e.clientY;
		playerMove();
	}
	else if (e.targetTouches)
	{
		mouse.x = /*e.targetTouches[0].clientX*/200;
		mouse.y = e.targetTouches[0].clientY;
		e.preventDefault();
		playerMove();
	}
}

canvas.addEventListener('mousemove', positionHandler, false);
canvas.addEventListener('touchstart', positionHandler, false);
canvas.addEventListener('touchmove', positionHandler, false); 

animate();