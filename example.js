var elasticsearch = require('elasticsearch');

    var client = new elasticsearch.Client({
        hosts: 'http://10.110.80.148:9200',
        log: 'trace'
        
        //configuration for production server
        /*hosts: [
    		'https://[username]:[password]@[server]:[port]/',
    		'https://[username]:[password]@[server]:[port]/'
    	]*/
    });
    
//   client.cluster.health({},function(err,resp,status) {  
//         console.log("-- Client Health --",resp);
//       });
  


// client.index({
//         index: 'news',
//         type: "document",
//         body: {
//             title: "T",
//             content: "C",
            
//         }
//     });

    let Parser = require('rss-parser');
 parserWebsite=['https://www.thehindu.com/news/national/feeder/default.rss','https://www.thehindu.com/news/international/feeder/default.rss','https://www.thehindu.com/news/states/feeder/default.rss','https://www.thehindu.com/news/cities/feeder/default.rss','https://www.thehindu.com/business/feeder/default.rss','https://www.thehindu.com/sport/feeder/default.rss','https://www.thehindu.com/sci-tech/science/feeder/default.rss'];

let parser = new Parser();
 for(i=0;i<parserWebsite.length;i++){
(async () => {

  let feed = await parser.parseURL(parserWebsite[i]);


  feed.items.forEach(item => {
    console.log(item.title + ':' + item.content+':'+item.pubDate)
    client.index({
        index: 'news',
        type: "document",
        body: {
            title: item.title,
            content: item.content,
            
        }
    });
  
  });

})();
setTimeout(function(){}, 3000);
 }
