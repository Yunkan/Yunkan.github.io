var div = document.getElementById("div");
var btn = document.getElementById("btn");
var a;
div.innerHTML = "00:00:00";


function func()
{
	div.className = "";
	if(btn.innerHTML == "Стоп")
	{
		clearInterval(a);
		div.innerHTML = "00:00:00";
		btn.innerHTML = "Старт";
		return;
	}
	btn.innerHTML = "Стоп";

	var hours = document.getElementById("hours").value;
	var min = document.getElementById("min").value;
	var sec = document.getElementById("sec").value;
	var save = 0;

	if(hours == "" || hours < 0) hours = 0; 
	if(min == "" || min < 0) min = 0;
	if(sec == "" || sec < 0) sec = 0;

	hours = parseInt(hours); 
	min = parseInt(min); 
	sec = parseInt(sec); 

	if(hours == 0 && min == 0 && sec == 0)
	{
		clearInterval(a);
		div.innerHTML = "00:00:00";
		btn.innerHTML = "Старт";
		return;
	}

	a = setInterval(function()
	{
		if(sec >= 60)
		{
			save += Math.floor(sec / 60);
			sec -= save * 60;
			min += save;
		}
		if(min >= 60)
		{
			hours += Math.floor(min / 60);
			min -= hours * 60;
		}

		if(sec == 0 && min == 0 && hours == 0)
		{
			clearInterval(a);
			div.innerHTML = "00:00:00";
			btn.innerHTML = "Старт";

			div.className = "p";

			var audio = new Audio();
			audio.preload = 'auto';
			audio.src = 'super-mario-pobeda-bossa-fanfara-muzyka-iz-igry-nintendo.mp3';
			audio.play();

			return;
		}

		if(sec < 0)
		{
			min--;
			sec = 59;
		}
		if(min < 0)
		{
			hours--;
			min = 59;
		}
		
		if(hours < 10)
		{
			hours = parseInt(hours);
			hours = "0" + hours;
		}
		if(min < 10)
		{
			min = parseInt(min);
			min = "0" + min;
		}
		if(sec < 10)
		{
			sec = parseInt(sec);
			sec = "0" + sec;
		}
		
		div.innerHTML = hours + ":" + min + ":" + sec;

		sec--;

	},
	1000);
}