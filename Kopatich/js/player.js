function Player() {
    this.w = 50;
    this.h = 50;
    this.x = cnvWidth / 2 - this.w / 2;
    this.y = cnvHeight / 2 - this.h / 2;
    this.dx = 10;
    this.dy = 10;
    this.hp = 100;
    this.score = 0;
    this.moveDirection = {
        up: false,
        down: false,
        right: false,
        left: false
    }
    this.shooting = false;
    this.boughtWeapons = [];
    this.weapon = null;
    this.dmgCooldown = 0;
    this.bullets = [];
}

Player.prototype.draw = function() {
    if(this.hp <= 0) {
        ctx.fillStyle = '#f00';
        for(let i = 0; i < getRandom(10, 15); i++) {
            ctx.arc(
                this.x + i * getRandom(-5, 5) + this.w / 2,
                this.y + i * getRandom(-5, 5) + this.h / 2,
                getRandom(2, 8),
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    } else {
        ctx.fillStyle = '#F57309';
        ctx.fillRect(~~this.x, ~~this.y, this.w, this.h);
        ctx.fillStyle = '#ffc104';
        ctx.arc(~~(this.x + this.w / 2), ~~(this.y + this.h / 2), ~~(this.w / 2.5), 0, Math.PI * 2);
        ctx.fill();
    }

    this.move();
    this.shoot();

    this.weapon.cooldown--;
}

Player.prototype.move = function() {
	if(this.moveDirection.up && this.y >= 0) {
        this.y -= ~~this.dy;
    }
    if(this.moveDirection.down && this.y <= cnvHeight - this.h) {
        this.y += ~~this.dy;
    }
    if(this.moveDirection.right && this.x <= cnvWidth - this.w) {
        this.x += ~~this.dx;
    }
    if(this.moveDirection.left && this.x >= 0) {
        this.x -= ~~this.dx;
    }

    enemies.forEach((enemy, enemyIndex) => {
        this.dmgCooldown--;
        if(this.dmgCooldown <= 0 && checkCollision(this, enemy)) {
            this.setHp(-1);
            this.dmgCooldown = 50;
        }
    });
}

Player.prototype.shoot = function() {
    if(this.shooting && this.weapon.cooldown <= 0) {
        this.weapon.shoot();
        this.weapon.cooldown = this.weapon.currentCooldown;
    }
}

Player.prototype.setHp = function(points) {
    this.hp = this.hp + +points > 100 ? 100 : this.hp + +points;
    if(this.hp >= 0) document.querySelector('.hp-bar').innerHTML = `HP: ${this.hp}`;
    if(this.hp < 0) {
        document.querySelector('.game-over').classList.add('front');
        this.dx = this.dy = 0;
    }
}

Player.prototype.setScore = function(points) {
    this.score += points;
    document.querySelector('.score-bar').innerHTML = `Мёд: ${this.score}`;
}

Player.prototype.getWeapon = function(weapon) {
    this.weapon = this.boughtWeapons[weapon];
}

const player = new Player();
document.querySelectorAll('.weapon button').forEach(((element, i, arr) => {
    element.addEventListener('click', (e) => {
        if(player.score >= element.dataset.price && !element.classList.contains('bought')) {
            if(element.dataset.weapon) {
                player.boughtWeapons[element.dataset.weapon] = new Weapon(element.dataset.weapon);
                player.getWeapon(element.dataset.weapon);
                player.setScore(-element.dataset.price);
                element.classList.add('bought');
                element.innerHTML = 'Выбрать';
            } else if(element.dataset.heal) {
                player.setHp(element.dataset.heal);                
                player.setScore(-element.dataset.price);
            }
        }
        if(element.classList.contains('bought')) {
            player.getWeapon(element.dataset.weapon);

            arr.forEach(el => {
                if(el.classList.contains('bought')) {
                    el.classList.remove('selected');
                    el.innerHTML = 'Куплено';
                }
            });

            element.classList.add('selected');
            element.innerHTML = 'Выбрано';
        }
    });
}));