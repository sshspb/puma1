/*
 * Запрос погоды в Toksovo, Cleveland 
 * const ids = ["482443","492712","580724","5152599"];
 * const columns = ["Журавлиное", "Синявино", "Арзамас", "Кливленд"];
*/
const fs = require('fs');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
  
var url = 'http://api.openweathermap.org/data/2.5/group?id=482443,5152599&appid=6bf470f1b018d810c7b658222454cf5a';
request(url, function (error, response, body) {
  if (!error && response && (response.statusCode == 200)) {
    var result = JSON.parse(body);
    // в базу данных на mLab информацию по "Журавлиное"("Токсово")
    MongoClient.connect('mongodb://<dbuser>:<dbpassword>@ds159254.mlab.com:59254/edu', function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      const db = client.db('edu');
      const collection = db.collection('toksovo');
      collection.insert([{ 
        "t": result.list[0].main.temp,
        "p": result.list[0].main.pressure,
        "h": result.list[0].main.humidity,
        "s": result.list[0].wind.speed,
        "d": result.list[0].wind.deg,
        "u": result.list[0].dt
      }], function(err, result) {
        assert.equal(err, null);
        client.close();
      });
    });
    // последние 6 измерений с периодичностью 4 часа храним на локальной машине
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
