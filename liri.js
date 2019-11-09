require('dotenv').config();

// import node packages axios, fs, moment, node-spotify-api, chalk
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
const chalk = require('chalk');
const Spotify = require('node-spotify-api');

// import api keys
const omdbApiKey = process.env.omdb_api_key;
const bandsInTownApiKey = process.env.bands_in_town_api_key;

const spotify = new Spotify({
  id: process.env.spotify_api_key,
  secret: process.env.spotify_secret
});

// use process argv to take in user input
// slice the array from 3
// switch case comparing index 0 to concert-this, spotify-this-song, movie-this, and do-what-it-says
// default return something so the user knows it was invalid input
const userTask = process.argv[2];
let userInfoPlus = process.argv.slice(3).join("+");
let userInfoSpace = process.argv.slice(3).join(" ");
let bandsUrl;
let movieUrl;

// generic axios get url call
// response function inputs optional
function axiosCall(url, responseFunction) {
    axios.get(url)
    .then(response => responseFunction(response))
    .catch(error => {
        console.log(error.response.status)
        console.log("");
        console.log(`Please input a valid search term`);
        console.log("");
    });
}

// response.data[0].venue has name and venue location
// response.data[0].datetime has date of the event
// loop through data array and log the info
// display city info based on USA or not
function bandsInTownResponseFunction(response) {
    console.log(""); console.log("");

    response.data.forEach(element => {
        if (element.venue.country === "United States") {
            console.log(
                chalk.blue(moment(element.datetime).format('MM/DD/YYYY')) + " -- " +
                element.venue.name + " -- " +
                chalk.blue(element.venue.city + ", " +
                element.venue.region)
            );
        } else {
            console.log(
                chalk.blue(moment(element.datetime).format('MM/DD/YYYY')) + " -- " +
                element.venue.name + " -- " +
                chalk.blue(element.venue.city + ", " +
                element.venue.country)
            );
        }

        console.log(""); console.log("");
    });
}

// use spotify node package to call spotify api 
// default search is "The Sign"
function spotifyResponseFunction() {

    if (!userInfoSpace) userInfoSpace = "The Sign";

    spotify.search({ type: 'track', query: userInfoSpace }, function(error, data) {
        if (error) {
            console.log("");
            console.log(`Please input a valid search term`);
            console.log("");
            return console.log('Error occurred: ' + error);
        }
       
      console.log(data.tracks.items[0]); 
      });
}

// display title of movie, year, imdb rating, rotten tomatoes, country, language, plot, actors
// response.data has all those properties
// grab keys Title, Year, Ratings[0].Value, Ratings[1].Value, Country, Language, Plot, Actors
function ombdResponseFunction(response) {
    console.log(""); console.log("");
    console.log(`${chalk.green('Title:')} ${response.data.Title}`); console.log("");
    console.log(`${chalk.green('Release Year:')} ${response.data.Year}`); console.log("");
    console.log(`${chalk.green('IMDb Rating:')} ${response.data.Ratings[0].Value}`); console.log("");
    console.log(`${chalk.green('Rotten Tomatoes Rating:')} ${response.data.Ratings[1].Value}`); console.log("");
    console.log(`${chalk.green('Country:')} ${response.data.Country}`); console.log("");
    console.log(`${chalk.green('Language:')} ${response.data.Language}`); console.log("");
    console.log(`${chalk.green('Plot:')} ${response.data.Plot}`); console.log("");
    console.log(`${chalk.green('Actors:')} ${response.data.Actors}`);
    console.log(""); console.log("");
}

switch (userTask) {

    // add user info to bands url
    // run axios call with bands function
    case 'concert-this':
        bandsUrl = `https://rest.bandsintown.com/artists/${userInfoPlus}/events?app_id=${bandsInTownApiKey}`;
        axiosCall(bandsUrl, bandsInTownResponseFunction);
        break;

    case 'spotify-this-song':
        spotifyResponseFunction();
        break;

    case 'movie-this':
        if (!userInfoPlus) userInfoPlus = "Mr.+Nobody"
        movieUrl = `https://omdbapi.com/?t=${userInfoPlus}&apikey=${omdbApiKey}`;
        axiosCall(movieUrl, ombdResponseFunction)
        break;

    case 'do-what-it-says':
        break;

    default:
        console.log(""); console.log("");
        console.log(chalk.blue("Please input a valid LIRI command"));
        console.log("");
        console.log(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++`);
        console.log("");
        console.log(chalk.yellow("Valid commands are:"));
        console.log("");
        console.log(`concert-this <${chalk.green('artist/band name here')}>`);
        console.log("");
        console.log(`movie-this <${chalk.green('movie name here')}>`);
        console.log("");
        console.log(`spotify-this-song <${chalk.green('song name here')}>`);
        console.log("");
        console.log("do-what-it-says");
        console.log(""); console.log("");
        break;
}