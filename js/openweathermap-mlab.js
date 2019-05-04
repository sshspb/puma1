/*
 * Запрос погоды в Toksovo, Cleveland 
 * const ids = ["482443","492712","580724","5152599"];
 * const columns = ["Журавлиное", "Синявино", "Арзамас", "Кливленд"];
*/
const fs = require('fs');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('../data/config');
const path = require('path');
  
request(config.openweathermapUrl, function (error, response, body) {
  if (!error && response && (response.statusCode == 200)) {
    var result = JSON.parse(body);
    // в базу данных на mLab.com информацию по "Журавлиное"("Токсово")
    MongoClient.connect(config.mlabDB, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      const db = client.db(config.dbName);
      const collection = db.collection('toksovo');
      collection.insert([{ 
        "_id": result.list[0].dt,
        "t": result.list[0].main.temp
      }], function(err, result) {
        assert.equal(err, null);
        client.close();
      });
    });
    // последние 6 измерений что с периодичностью 4 часа храним на локальной машине
    result.list[0].column = "Журавлиное";
    result.list[1].column = "Кливленд";
    var str = "";
    var weather = [];
    //var filename = localDB;
    var filename = path.resolve(__dirname, "../", config.localDB)
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
