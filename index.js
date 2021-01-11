const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync('home.html', 'UTF-8');

const replaceVal = (oldVal, newVal) => {
	let modifiedVal = oldVal.replace('{%tempVal%}', parseFloat(newVal.main.temp-273.15).toFixed(2));
	modifiedVal = modifiedVal.replace('{%tempMin%}', parseFloat(newVal.main.temp_min-273.15).toFixed(2));
	modifiedVal = modifiedVal.replace('{%tempMax%}', parseFloat(newVal.main.temp_max-273.15).toFixed(2));
	modifiedVal = modifiedVal.replace('{%location%}', newVal.name);
	modifiedVal = modifiedVal.replace('{%country%}', newVal.sys.country);
	modifiedVal = modifiedVal.replace('{%tempStatus%}', newVal.weather[0].main);
	return modifiedVal;
}

const server = http.createServer((req, res) => {
	if(req.url == '/'){
		requests('http://api.openweathermap.org/data/2.5/weather?q=Sitamarhi&appid=28a457f74a1a2da60b4a19c670905af0')
			.on('data', (chunk) => {
				const objData = JSON.parse(chunk);
				const arrData = [objData];
  				//console.log(arrData[0].main.temp);
  				const realTimeData = arrData
  				.map((val) => replaceVal(homeFile, val))
  				.join("");
  				//console.log(realTimeData);
  				res.writeHeader(200, {"Content-Type": "text/html"});
  				res.write(realTimeData);
			})
			.on('end', (err) => {
  				if (err) return console.log('connection closed due to errors', err);
 
  				res.end();
			});
	}
});

server.listen(8000, '127.0.0.1', () => {
	console.log("listening on port number 8000");
});