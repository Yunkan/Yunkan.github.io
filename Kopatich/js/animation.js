function animate() {
    if(!paused) {
        cnv.width = cnvWidth;
        cnv.height = cnvHeight;

        enemyBlood.forEach(blood => blood.draw());
        player.bullets.forEach((bullet, index) => bullet.draw(index));
        if(player.hp > 0)
        	player.weapon.draw();
		player.draw();
        enemies.forEach(enemy => enemy.draw());
        explosionParticles.forEach((particle, index) => particle.draw(index));
        
        requestAnimationFrame(animate);
    }
}

document.querySelector('.main-menu button').addEventListener('click', () => {
    document.querySelector('.main-menu').remove();
    enemySpawn();
    animate();
});