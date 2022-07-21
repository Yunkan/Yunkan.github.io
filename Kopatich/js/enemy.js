function Enemy(x, y) {
    this.x = x;
    this.y = y;
    this.w = 25;
    this.h = 25;
    this.hp = getRandom(3, 8);

    this.body = [
                    ['g', 'g', 'g', 'g', 'g'],
                    ['g', 'g', 'g', 'g', 'g'],
                    ['g', 'g', 'g', 'g', 'g'],
                    ['g', 'g', 'g', 'g', 'g'],
                    ['g', 'g', 'g', 'g', 'g']
                ];

    this.speed = getRandom(1, 3);

    this.initLine();
}

Enemy.prototype.draw = function() {
    ctx.fillStyle = '#255b0b';
    ctx.fillRect(this.x, this.y, this.w, this.h);
    for(let i = 0; i < this.body.length; i++) {
        for(let j = 0; j < this.body[i].length; j++) {
            if(this.body[i][j] === 'b') {
                ctx.fillStyle = '#AE0101';
                ctx.fillRect(~~(this.x + j * this.w / 5), ~~(this.y + i * this.h / 5), ~~(this.w / 5), ~~(this.h / 5));
            }
        }
    }

    this.move();
}

Enemy.prototype.initLine = function() {
    this.endX = player.x;
    this.endY = player.y;

    this.dx = this.endX - this.x;
    this.dy = this.endY - this.y;

    this.line = Math.sqrt(this.dx ** 2 + this.dy ** 2);

    this.dx = this.speed * this.dx / this.line;
    this.dy = this.speed * this.dy / this.line;
}

Enemy.prototype.move = function() {
    this.initLine();

    this.x += ~~this.dx;
    this.y += ~~this.dy;
}

Enemy.prototype.takeDamage = function(dmg, index, bullet = { x: this.x - this.w / 2, y: this.y - this.h / 2, dx: getRandom(-40, 40), dy: getRandom(-40, 40) }) {
    this.hp -= dmg;
    cnv.classList.add('shake-little');
    setTimeout(() => cnv.classList.remove('shake-little'), 100);

    for(let i = 0; i < dmg * 2; i++) {
        const part = {
            i: getRandom(0, this.body.length - 1),
            j: getRandom(0, this.body.length - 1)
        };

        this.body[part.i][part.j] = 'b';
        enemyBlood.push(new Blood(this.x + this.w / 2, this.y + this.h / 2, bullet));
    }

    if(this.hp <= 0) {
        for(let i = 0; i < 25; i++)
            explosionParticles.push(new ExplosionParticle(this.x + this.w / 2, this.y + this.h / 2, getRandom(4, 8), getRandom(4, 8), '#AE0101', 6));
        enemies.splice(index, 1);
        player.setScore(getRandom(10, 20));
    }
}

function Blood(x, y, bullet) {
    this.r = getRandom(2, 4);
    this.x = x - this.r / 2;
    this.y = y - this.r / 2;

    this.endX = bullet.x * bullet.dx / 2;
    this.endY = bullet.y * bullet.dy / 2;

    this.dx = (this.endX - this.x) / getRandom(50, 200);
    this.dy = (this.endY - this.y) / getRandom(50, 200);

    this.line = Math.sqrt(this.dx ** 2 + this.dy ** 2);

    this.dx = player.weapon.bulletSpeed * this.dx / this.line;
    this.dy = player.weapon.bulletSpeed * this.dy / this.line;

    this.dc = this.line;
}

Blood.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = '#f00';
    ctx.arc(~~this.x, ~~this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    this.move();
}

Blood.prototype.move = function() {
    if(this.dc >= 0) {
        this.x += ~~this.dx;
        this.y += ~~this.dy;
    }
    this.dc -= Math.sqrt(this.dx ** 2 + this.dy ** 2);
}

const enemySpawn = () => {
    let side = getRandom(0, 3);
    let sideCoordinates = {
        x: 0,
        y: 0
    };

    switch(side) {
        case 0:
            sideCoordinates.x = getRandom(0, cnvWidth);
            sideCoordinates.y = getRandom(-100, -50);
            break;
        case 1:
            sideCoordinates.x = getRandom(cnvWidth, cnvWidth + 100);
            sideCoordinates.y = getRandom(0, cnvHeight);
            break;
        case 2:
            sideCoordinates.x = getRandom(0, cnvWidth);
            sideCoordinates.y = getRandom(cnvHeight, cnvHeight + 100);
            break;
        case 3:
            sideCoordinates.x = getRandom(-100, -50);
            sideCoordinates.y = getRandom(0, cnvHeight);
            break;
    }

    if(!paused)
    	enemies.push(new Enemy(sideCoordinates.x, sideCoordinates.y));

    setTimeout(enemySpawn, 1000);
}

const bloodRemove = () => {
	if(enemyBlood.length > 0) {
		for(let i = 0; i < 1 + ~~(Math.abs((1000 - enemyBlood.length) / 1000)); i++)
			enemyBlood.splice(0, 1);
	}
	setTimeout(bloodRemove, 1000 - enemyBlood.length);
}

bloodRemove();