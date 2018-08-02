require("dotenv").config();

var request = require('request');

var Twitter = require('twitter');

var Spotify = require('node-spotify-api');

var fs = require("fs");

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
 
var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
});

var command = process.argv.slice(2);

function displayTweets() {
    var tweetArr = [];
    var params = {screen_name: 'kannasama77', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            throw error;
         } else {
              for(var i = 0; i < tweets.length; i++) {
                 //console.log(tweets[i].created_at);
                 //console.log(tweets[i].text);
                tweetArr.push(tweets[i].created_at, tweets[i].text);
              }
        console.log(tweetArr);
        fs.appendFileSync("log.txt", `${tweetArr.join("\n")}\n\r`);
        };
    })
}

function searchMovie(y) {
    var movieArr = [];
    var url = "http://www.omdbapi.com/?t="+ y + "&y=&plot=short&apikey=trilogy";

    request(url, function(error, response, body) {
    //console.log(body)
        if (!error && response.statusCode === 200) {
            console.log(JSON.parse(body).Title);
            console.log(JSON.parse(body).Year);
            console.log(JSON.parse(body).imdbRating);
            console.log(JSON.parse(body).Ratings[1].Value);
            console.log(JSON.parse(body).Country);
            console.log(JSON.parse(body).Language);
            console.log(JSON.parse(body).Plot);
            console.log(JSON.parse(body).Actors);
            movieArr.push(JSON.parse(body).Title, JSON.parse(body).Year, JSON.parse(body).imdbRating, JSON.parse(body).Ratings[1].Value, JSON.parse(body).Country, JSON.parse(body).Language, JSON.parse(body).Plot, JSON.parse(body).Actors);

            fs.appendFileSync("log.txt", `${movieArr.join("\n")}\n\r`);
        }
    });
}

function searchSong(x) {
    var songArr = [];
    spotify.search({ type: 'track', query: x }, function(err, data) {
        if ( err ) {
            return console.log('Error occurred: ' + err); 
        }
        else {
            var songInfo = data.tracks.items[0];
            console.log(songInfo.artists[0].name);
            console.log(songInfo.name);
            console.log(songInfo.album.name);
            console.log(songInfo.preview_url);
            songArr.push(songInfo.artists[0].name, songInfo.name, songInfo.album.name, songInfo.preview_url);
            fs.appendFileSync("log.txt", `${songArr.join("\n")}\n\r`);
        };
    });
}

function doThis() {
    fs.readFile("./random.txt", "utf8", function(err, data){
        if (err) {
            return console.log(err);
        }
        //console.log(data);
        var array = data.split(",");
        console.log(array[0], array[1]);
        var paraThree = array[0];
        var paraFour = array[1];
        if (paraThree == "spotify-this-song") {
            searchSong(paraFour);
        } else if (paraThree == "movie-this") {
            searchMovie(paraFour);
        } else if (paraThree == "my-tweets") {
            displayTweets();
        }
    });
}

switch(command[0]) {
    case "my-tweets":
      displayTweets();
      break;
    case "spotify-this-song":
      if(command[1]){ 
        searchSong(command[1]);
        } else { 
          searchSong("The Sign");
        }
      break;
    case "movie-this":
      if(command[1]){ 
        searchMovie(command[1]);
        } else { 
          searchMovie("Mr.Nobody");
        }
      break;
    case "do-what-it-says":
      doThis();
      break;
}