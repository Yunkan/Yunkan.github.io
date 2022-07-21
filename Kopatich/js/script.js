const cnv = document.getElementById('cnv');
const ctx = cnv.getContext('2d');

cnv.width = window.innerWidth;
cnv.height = window.innerHeight;

let cnvWidth = cnv.width;
let cnvHeight = cnv.height;

window.onresize = function() {
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;

    cnvWidth = cnv.width;
    cnvHeight = cnv.height;
}

const mouse = {
    x: 0,
    y: 0
}

var player;
var enemies = [];
const enemyBlood = [];

var paused = false;

window.onkeydown = function(e) {
    switch(e.key.toLowerCase()) {
        case 'w':
        case 'ц':
            player.moveDirection.up = true;
            break;
        case 's':
        case 'ы':
            player.moveDirection.down = true;
            break;
        case 'd':
        case 'в':
            player.moveDirection.right = true;
            break;
        case 'a':
        case 'ф':
            player.moveDirection.left = true;
            break;
        case 'escape':
            if(!document.querySelector('.main-menu') && player.hp > 0) {
                document.querySelector('.pause-menu').classList.toggle('front');
                paused = !paused;
                animate();
            }
            break;
    }
}

window.onkeyup = function(e) {
    switch(e.key.toLowerCase()) {
        case 'w':
        case 'ц':
            player.moveDirection.up = false;
            break;
        case 's':
        case 'ы':
            player.moveDirection.down = false;
            break;
        case 'd':
        case 'в':
            player.moveDirection.right = false;
            break;
        case 'a':
        case 'ф':
            player.moveDirection.left = false;
            break;
    }
}

window.onmousemove = function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

window.onmousedown = function() {
    player.shooting = true;
}

window.onmouseup = function() {
    player.shooting = false;
}

function getRandom(min, max) {
    return ~~(min + Math.random() * (max + 1 - min));
}

function checkCollision(obj1, obj2) {
    if(obj1 && obj2) {
        return ((obj1.x + obj1.w >= obj2.x) && (obj1.x <= obj2.x + obj2.w) &&
            (obj1.y + obj1.h >= obj2.y) && (obj1.y <= obj2.y + obj2.h));
    }
}

function ExplosionParticle(x, y, w, h, color, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.alpha = 1;
    this.dx = getRandom(-1 * speed, 1 * speed);
    this.dy = getRandom(-1 * speed, 1 * speed);
}

ExplosionParticle.prototype.draw = function(index) {
    this.alpha -= 0.025;
    if(this.alpha <= 0) {
        explosionParticles.splice(index, 1);
    }
    ctx.save();
    ctx.globalAlpha = Math.abs(this.alpha);
    ctx.fillStyle = this.color;
    ctx.fillRect(~~this.x, ~~this.y, this.w, this.h);
    ctx.restore();

    this.move(index);
}

ExplosionParticle.prototype.move = function(index) {
    this.x += ~~this.dx;
    this.y += ~~this.dy;
}

const explosionParticles = [];

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
}