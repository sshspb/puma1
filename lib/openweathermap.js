/*
 * Requests the weather in Toksovo, Sinyavino, Arzamas, Cleveland
 * const ids = ["482443","492712","580724","5152599"];
 * const columns = ["Журавлиное", "Синявино", "Арзамас", "Кливленд"];
*/
const fs = require('fs');
const request = require('request');
  
var url = 'http://api.openweathermap.org/data/2.5/group?id=482443,5152599&appid=6bf470f1b018d810c7b658222454cf5a';
request(url, function (error, response, body) {
  if (!error && response && (response.statusCode == 200)) {
    var result = JSON.parse(body);
    result.list[0].column = "Журавлиное";
    result.list[1].column = "Кливленд";
    var str = "";
    var weather = [];
    var filename = './weather.json';
    if (fs.existsSync(filename)) {
      str = fs.readFileSync(filename, 'utf8');
      weather = JSON.parse(str);
    }
    weather.push(result);
    if (weather.length > 6) {
      weather.splice(0, weather.length - 6);
    }
    str = JSON.stringify(weather);
    fs.writeFileSync(filename, str);
  }
});
