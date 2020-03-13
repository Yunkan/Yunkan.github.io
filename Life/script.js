var ctx = cnv.getContext('2d');

cnv.width = 700;
cnv.height = 700;

function getRandom(min, max)
{
	return Math.floor(min + Math.random() * (max + 1 - min));
}

var population = [],
	population2 = [],
	life = false,
	cycle = 0;

cnv.onclick = function(e)
{
	var x = e.offsetX;
	var y = e.offsetY;

	x = Math.floor(x / 10);
	y = Math.floor(y / 10);

	for(var i = 0; i < population.length; i++)
	{
		for(var j = 0; j < population[i].length; j++)
		{
			if(i == x && j == y && !life)
			{
				population[i][j] == 0 ? population[i][j] = 1 : population[i][j] = 0;
			}
		}
	}
}

function clearGenerate()
{
	for(var i = 0; i < 70; i++)
	{
		population[i] = [];
		for(var j = 0; j < 70; j++)
		{
			population[i][j] = 0;
		}
	}
}

function randomGenerate()
{
	if(!life)
	{
		clearGenerate();
		for(var i = 0; i < 70; i++)
		{
			population[i] = [];
			for(var j = 0; j < 70; j++)
			{
				population[i][j] = getRandom(0, 1);
			}
		}
	}
}

function drawField()
{
	for(var x = 0; x < 70; x++)
	{
		for(var y = 0; y < 70; y++)
		{
			ctx.strokeStyle = "#aaa";
			ctx.strokeRect(x * 10, y * 10, 10, 10);
		}
	}
}

function draw()
{
	for(var i = 0; i < population.length; i++)
	{
		for(var j = 0; j < population[i].length; j++)
		{
			if(population[i][j] == 1)
			{
				ctx.fillRect(i * 10, j * 10, 10, 10);
			}
		}
	}

	if(life)
		step();
}

function step()
{
	population2 = [];
	for(var i = 0; i < population.length; i++)
	{
		population2[i] = [];
		for(var j = 0; j < population[i].length; j++)
		{
			var neighbors = 0;

			if(population[fpm(i) - 1][j] == 1) neighbors++;
			if(population[i][fpp(j) + 1] == 1) neighbors++;
			if(population[fpp(i) + 1][j] == 1) neighbors++;
			if(population[i][fpm(j) - 1] == 1) neighbors++;
			if(population[fpm(i) - 1][fpp(j) + 1] == 1) neighbors++;
			if(population[fpp(i) + 1][fpp(j) + 1] == 1) neighbors++;
			if(population[fpp(i) + 1][fpm(j) - 1] == 1) neighbors++;
			if(population[fpm(i) - 1][fpm(j) - 1] == 1) neighbors++;

			if(population[i][j] == 0 && neighbors == 3) population2[i][j] = 1;
			(population[i][j] == 1 && neighbors == 2 || neighbors == 3) ? population2[i][j] = 1 : population2[i][j] = 0;
		}
	}

	population = population2;
	cycle++;
	document.querySelector(".cycle").innerHTML = "Цикл: " + cycle;
}

function fpm(i)
{
	if(i == 0) return 70;
	else return i;
}

function fpp(i)
{
	if(i == 69) return -1;
	else return i;
}

clearGenerate();

setInterval(function()
{
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	drawField();
	draw();
}, 100)

function stopLife()
{
	life = false;
	cycle = 0;
	document.querySelector(".cycle").innerHTML = "Цикл: " + cycle;
	clearGenerate();
}