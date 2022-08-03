const enemyEffects = [
	{
		name: 'armor',
		draw: function(x, y, w, h) {
			ctx.strokeStyle = '#A7A5A5';
			ctx.lineWidth = 3;
			ctx.strokeRect(x, y, w, h);
		},
		act: function(enemy) {
			enemy.hp += 5;
		}
	}	
];