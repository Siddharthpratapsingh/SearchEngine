const express = require('express');
const elasticSearch = require('elasticsearch');
var router = express.Router();
var app=express();
var http = require('http');
var server = http.createServer(app);
var client = new elasticSearch.Client({
        hosts: 'http://10.110.80.148:9200',
        log: 'trace'
        
        //configuration for production server
        /*hosts: [
    		'https://[username]:[password]@[server]:[port]/',
    		'https://[username]:[password]@[server]:[port]/'
    	]*/
    });
    module.exports.search = function(searchData, callback) {
  client.search({
    index: 'news',
    type: 'document',
    body: {
      query: {
        bool: {
          must: {
            match: {
              "description": searchData.searchTerm
            }
          }
        }
      }
    }
  }).then(function (resp) {
    callback(resp.hits.hits);
  }, function (err) {
      callback(err.message)
      console.log(err.message);
  });
}

app.get('/search', function (req, res){
  // declare the query object to search elastic search and return only 200 results from the first result found. 
  // also match any data where the name is like the query string sent in
  let body = {
    size: 200,
    from: 0, 
    query: {
      match: {
          title: req.query['q']
      }
    }
  }
  // perform the actual search passing in the index, the search query and the type
  client.search({index:'news',  body:body, type:'document'})
  .then(results => {
    res.send(results.hits.hits);
  })
  .catch(err=>{
    console.log(err)
    res.send([]);
  });

})

app .listen( app.get(3000), function(){
  console.log( 'Express server listening on port ');
} );