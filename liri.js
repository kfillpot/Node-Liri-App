require("dotenv").config();
var keys = require("./keys");
var request = require('request');
var axios = require("axios");
var fs = require("fs");
var inquirer = require('inquirer');
var moment = require("moment");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var arg1 = process.argv[2]
var userInput = process.argv.slice(3).join(" ")






function whatItSays() {
    if (arg1 === 'do-what-it-says') {
        fs.readFile('./random.txt', 'UTF8', function(err, data) {
            if (err) {
                console.log("Error: " + err)
            }
            arg1 = data.substring(0, data.indexOf(","))
            userInput = data.substring(data.indexOf(",") + 2, data.length - 1)
            whatItSays();
        })
    }
    
    else if (arg1 === 'concert-this') {
        ConcertThis();
    }else if (arg1 === 'spotify-this-song') {
        SpotifyThis()
    }else if (arg1 === 'movie-this') {
        MovieThis();
    }else if (arg1 === 'do-what-it-says') {
        doThis();
    }else {
        console.log("Enter a valid command such as: 'concert-this', 'spotify-this-song', 'movie-this', or 'do-what-it-says'")
    }
}

//Function for concert-this
function ConcertThis() {
    if (userInput == "") {
        console.log("You must include an artist to search.");
    }
    else {
        axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp")
        .then(function(response) {
            var results = response.data;
            for (i = 0; i < 5; i++) {
                var venue = results[i].venue.name;
                if (results[i].country === "United States") {
                    var location = results[i].venue.city + ", " + results[i].venue.region
                }
                else {
                    var location = results[i].venue.city + ", " + results[i].venue.country
                }
                var date = moment(results[i].datetime)
                date = date.format("MM/DD/YYYY")
                console.log("\nVenue: " + venue + "\nLocation: " + location + "\nDate: " + date + "\n---------------------------------");
                fs.appendFile('log.txt', output, 'utf8', function(error) {
                    if (error) {
                        console.log("Error: " + error);
                    }
                })
            }
        })
    }

}
//Function for spotify-this-song
function SpotifyThis() {
      console.log("Here is the information.")
    if (userInput == "") {
        userInput = "I want it that way"
    }
    spotify.search({
        type: 'track',
        query: userInput
    }, function(err, data) {
        if (err) {
            console.log("Error occurred finding your song")
        }
        var results = data.tracks.items[0];
        console.log("\nArtist: " + results.artists[0].name);
        console.log("\nSong Title: " + results.name);
        console.log("\nPreview Link: " + results.preview_url);
        console.log("\nAlbum Title: " + results.album.name); 
       
        fs.appendFile('log.txt', 'utf8', function(error) {
            if (error) {
                console.log("Error: " + error);
            }
        })
    })
}


//Function for movie-this
function MovieThis() {
    if (userInput === "") {
        userInput = "Mr. Nobody"
    }
    axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + userInput)
    .then(function(response) {
        console.log(response.data.Title)
        results = response.data;
        var IMDB = results.Ratings.filter(function(item) {
            return item.Source === 'IMDB'
        }).map(function(item) {
            return item.Value.toString()
        })
        IMDB = IMDB.toString();
        var RT = results.Ratings.filter(function(item) {
            return item.Source === 'Rotten Tomatoes'
        }).map(function(item) {
            return item.Value.toString()
        })
        RT = RT.toString();
        console.log("\nTitle: " + results.Title);
        console.log("\nYear: " + results.Year);
        console.log("\nRatings: " + results.Ratings);
        console.log("\nIMDB Rating: " + IMDB);
        console.log("\nRotten Tomato Rating: " + RT);
        console.log("\nCountry: " + results.Country);
        console.log("\nLanguage: " + results.Language);
        console.log("\nPlot: " + results.Plot);
        console.log("\nActors: " + results.Actors);
        fs.appendFile('log.txt', 'utf8', function(error) {
            if (error) {
                console.log("Error:" + error);
            }
        })
    })
}
whatItSays();
