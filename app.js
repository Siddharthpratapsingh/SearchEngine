let Parser = require('rss-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/news";

let parser = new Parser();

(async () => {

  let feed = await parser.parseURL('https://www.thehindu.com/news/national/feeder/default.rss');


  feed.items.forEach(item => {
    console.log(item.title + ':' + item.content+':'+item.pubDate)
    MongoClient.connect(url, function(err, client) {
    if (err) throw err;

    var db = client.db('news')
    var datainsert = {
        'title':item.title,
        'content':item.content,
        'date':item.pubDate
    }
    // insert document to 'users' collection using insertOne
    db.collection("data").insertOne(datainsert, function(err, res) {
        if (err) throw err;
        console.log("Document inserted");
        // close the connection to db when you are done with it
        client.close();
    });
});
  });

})();
