var express = require("express");
var app = express();
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('app0TvSfnuijGrvYV');
var base1 = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('apphmFgGo5kBKFIsD');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(3000, () => {
 console.log("Server running on port 3000");
});
app.get("/time", (req, res, next) => {
  res.set('Content-Type', 'text/html')
  res.set('Access-Control-Allow-Origin', '*')
  base('Table 1').select({
        maxRecords: 1,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            var currentDate = new Date()
            console.log(currentDate)
            var dateString = currentDate
                .toString()
                .split(' ')
                .splice(0, 4)
                .join(' ')
            var nextMeeting = record.get('Formatted');
            console.log(String(nextMeeting), dateString)
            if (String(nextMeeting) == dateString) {
              res.send("today at 3:45pm")
            }
            else {
              res.send(String(nextMeeting))

            }
            
        });
        
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
    });
});

app.post('/post', (req, res) => {
    const project = req.body;

    // Output the project to the console for debugging
    console.log(project);
    base1('Table 1').create([
      {
        "fields": {"Name":project["name"],"URL":project["url"]}
      }
    ], function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        res.send(record.getId());
      });
    });
});
