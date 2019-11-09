require('dotenv').config();

// import api keys 
const spotifyApiKey = process.env.spotify_api_key;
const spotifySecret = process.env.spotify_secret;
const omdbApiKey = process.env.omdb_api_key;
const bandsInTownApiKey = process.env.bands_in_town_api_key;

// import node packages axios, fs, moment, node-spotify-api, chalk
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
const chalk = require('chalk');
const Spotify = require('node-spotify-api');

// use process argv to take in user input 
// slice the array from 3
// switch case comparing index 0 to concert-this, spotify-this-song, movie-this, and do-what-it-says 
// default return something so the user knows it was invalid input          
const userTask = process.argv[2];
const userInfo = process.argv.slice(3).join("+");

// generic axios get url call 
// response function inputs optional
function axiosCall(url, responseFunction) {
    axios.get(url)
    .then(response => responseFunction(response))
    .catch(error => console.log(error.response.status))
}

// response.data[0].venue has name and venue location 
// response.data[0].datetime has date of the event
// loop through data array and log the info
// display city info based on USA or not
function bandsInTownResponseFunction(response) {
    console.log("");

    response.data.forEach(element => {
        console.log(moment(element.datetime).format('MM/DD/YYYY'));
        console.log(element.venue.name);

        if (element.venue.country === "United States") {
            console.log(`${element.venue.city}, ${element.venue.region}`);
        } else {
            console.log(`${element.venue.city}, ${element.venue.country}`);
        }

        console.log("");        
    });
}

switch (userTask) {
    
    // add user info to bands url
    // run axios call with bands function
    case 'concert-this':
        bandsUrl = `https://rest.bandsintown.com/artists/${userInfo}/events?app_id=${bandsInTownApiKey}`;
        axiosCall(bandsUrl, bandsInTownResponseFunction);
        break;

    case 'spotify-this-song':
        break;

    case 'movie-this':
        break;

    case 'do-what-it-says':
        break;

    default:
        console.log("");
        console.log("");
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
        console.log("");
        console.log("");
        break;
}