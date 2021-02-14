function animate() {
    if(!paused) {
        cnv.width = cnvWidth;
        cnv.height = cnvHeight;

        ctx.beginPath();

        player.draw();
        player.bullets.forEach((bullet, index) => bullet.draw(index));
        enemies.forEach(enemy => enemy.draw());
        enemyBlood.forEach(blood => blood.draw());
        explosionParticles.forEach((particle, index) => particle.draw(index));

        requestAnimationFrame(animate);
    }
}

document.querySelector('.main-menu button').addEventListener('click', () => {
    document.querySelector('.main-menu').remove();
    enemySpawn();
    animate();
});