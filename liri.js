require("dotenv").config();
// console.log(process.argv);
var axios = require("axios");
var Spotify = require('node-spotify-api');

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// gets user input information to see what they want to do with this app
var userInput = process.argv[2];
var search = "";
var searchArr = process.argv;
for (var i = 3; i < searchArr.length; i++) {
    if (i > 3 && i < searchArr.length) {
        search = search + "+" + searchArr[i];
    }
    else {
        search += searchArr[i];

    }
}

// get aritist band concert information
function concertFind() {
    var bandsintownURL = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
    axios.get(bandsintownURL).then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var moment = require('moment');
                console.log(
                    "Venue: " + response.data[i].venue.name
                    + "\n Location: " + response.data[i].venue.city +
                    "\n Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY") + "\n -------"
                );
            }

        }
    )

}
if (userInput == "concert-this") {
    concertFind();
}

// spotify song information
function spotifyThis(search) {
    if (!search.length) {
        search = "never+gonna+give+you+up";
    }
    spotify.search({
        type: "track",
        query: search
    }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("--------\nArtist: " + data.tracks.items[0].artists[0].name + "\nSong Name: " + data.tracks.items[0].name +
                "\nPreview Link: " + data.tracks.items[0].artists[0].external_urls.spotify + "\nAlbum: " + data.tracks.items[0].album.name + "\n --------");

        }
    })

}
if (userInput == "spotify-this-song") {
    spotifyThis(search);
}

function movieFind(search) {
    if (!search.length) {
        search = 'remember+the+titans'
    }
    var movieURL = "http://www.omdbapi.com/?t=" + search + "&apikey=trilogy";
    axios.get(movieURL).then(
        function (response) {
            console.log("--------\nTitle: " + response.data.Title + "\nYear of Release: " + response.data.Year + "\nIMBD Rating: " +
                response.data.Ratings[0].Value + "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\nCountry: " + response.data.Country +
                "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + "\n --------");
        }
    )

}
if (userInput == "movie-this") {
    movieFind(search);
}

if (userInput == "do-what-it-says") {
    var fs = require("fs");

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        }
        console.log(data);

        var dataArr = data.split(",");
        console.log(dataArr);

        if (dataArr[0] == "spotify-this-song") {
            spotifyThis(dataArr[1]);
        }
        if (dataArr[0] == "concert-this") {
            concertFind(dataArr[1]);
        }
        if (dataArr[0] == "movie-this") {
            movieFind(dataArr[1]);
        }

    })
}





