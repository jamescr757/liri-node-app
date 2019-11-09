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
let userTask = process.argv[2];
let userInfo = process.argv.slice(3).join(" ");
let bandsUrl;
let movieUrl;

// generic axios get url call
function axiosCall(url, responseFunction) {
    axios.get(url)
    .then(response => responseFunction(response))
    .catch(error => {
        console.log("");
        console.log(chalk.green('Please input a valid search term'));
        console.log("");
    });
}

// response.data[0].venue has name and venue location
// response.data[0].datetime has date of the event
// loop through data array and log the info
// display city info based on USA or not
function bandsInTownResponseFunction(response) {
    console.log(``); 
    console.log(chalk.blue("=========================================================================================================")); 
    console.log(``); 
    console.log(``); 

    // if no error but data array has no data
    // else loop through array and display info
    if (response.data.length === 0) {
        console.log(chalk.green(userInfo + ' does not have any upcoming shows'));
        console.log("");
        console.log("");
    } else {
        response.data.forEach(element => {

            if (element.venue.country === "United States") {
                console.log(
                    chalk.green(moment(element.datetime).format('MM/DD/YYYY')) + " -- " +
                    element.venue.name + " -- " +
                    chalk.green(element.venue.city + ", " +
                    element.venue.region)
                );

            } else {
                console.log(
                    chalk.green(moment(element.datetime).format('MM/DD/YYYY')) + " -- " +
                    element.venue.name + " -- " +
                    chalk.green(element.venue.city + ", " +
                    element.venue.country)
                );
            }
    
            console.log(``); 
            console.log(``); 
        });   
    }


    console.log(chalk.blue("=========================================================================================================")); 
    console.log(``); 
}

// use spotify node package to call spotify api 
// default search is "The Sign by Ace of Base"
// display artist, song name, preview link, album title
function spotifyResponseFunction() {

    if (!userInfo) userInfo = "The Sign Ace of Base";

    spotify.search({ type: 'track', query: userInfo }, function(error, data) {
        if (error) {
            console.log("");
            console.log(chalk.green('Please input a valid search term'));
            console.log("");
        } else {
            console.log(``); 
            console.log(chalk.blue("=========================================================================================================")); 
            console.log(``); 
            
            data.tracks.items.forEach(element => {
                
                console.log(chalk.green("Artist name: ") + element.artists[0].name); 
                console.log("");
                console.log(chalk.green("Song: ") + element.name); 
                console.log("");
                console.log(chalk.green("30 Second Preview: ") + element.preview_url); 
                console.log(``);
                console.log(chalk.green("Album Title: ") + element.album.name);
                
                console.log(``);
                console.log(chalk.yellow('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'));
                console.log(``);
            })
            
            console.log(``); 
            console.log(chalk.blue("========================================================================================================")); 
            console.log(``);
        }
       
      });
}

// display title of movie, year, imdb rating, rotten tomatoes, country, language, plot, actors
// response.data has all those properties
// grab keys Title, Year, Ratings[0].Value, Ratings[1].Value, Country, Language, Plot, Actors
function ombdResponseFunction(response) {
    const data = response.data;

    console.log(``); 
    console.log(chalk.blue("=========================================================================================================")); 
    console.log(``); 

    console.log(`${chalk.green('Title:')} ${data.Title}`); 
    console.log("");
    console.log(`${chalk.green('Release Year:')} ${data.Year}`); 
    console.log("");
    console.log(`${chalk.green('IMDb Rating:')} ${data.Ratings[0].Value}`); 
    console.log("");
    console.log(`${chalk.green('Rotten Tomatoes Rating:')} ${data.Ratings[1].Value}`); 
    console.log("");
    console.log(`${chalk.green('Country:')} ${data.Country}`); 
    console.log("");
    console.log(`${chalk.green('Language:')} ${data.Language}`); 
    console.log("");
    console.log(`${chalk.green('Plot:')} ${data.Plot}`); 
    console.log("");
    console.log(`${chalk.green('Actors:')} ${data.Actors}`);

    console.log(``); 
    console.log(chalk.blue("=========================================================================================================")); 
    console.log(``); 
}

// switch case function 
// compare against concert-this, spotify-this-song, movie-this
function switchCase() {

    switch (userTask) {

        // add user info to bands url
        // run axios call with bands function
        case 'concert-this':
            bandsUrl = `https://rest.bandsintown.com/artists/${userInfo}/events?app_id=${bandsInTownApiKey}`;
            axiosCall(bandsUrl, bandsInTownResponseFunction);
            break;

        case 'spotify-this-song':
            spotifyResponseFunction();
            break;

        // add user info to movie url
        // if no user info, default to Mr. Nobody
        // run axios call with movie function
        case 'movie-this':
            if (!userInfo) userInfo = "Mr.+Nobody"
            movieUrl = `https://omdbapi.com/?t=${userInfo}&apikey=${omdbApiKey}`;
            axiosCall(movieUrl, ombdResponseFunction)
            break;

        case 'do-what-it-says':
            break;

        default:
            console.log(""); console.log("");
            console.log(chalk.green("Please input a valid LIRI command"));
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
}

// conditional logic for do-what-it-says command 
// update userTask with task from random.txt file
// update userInfo 
// else, run switch case with no updates
if (userTask === "do-what-it-says") {
    fs.readFile('./random.txt', 'utf8', (error, data) => {

        if (error) return console.log(error);

        dataArray = data.split(',');
        userTask = dataArray[0];
        userInfo = dataArray[1];

        // need switch case here because asynchronous function
        switchCase();
    })
} else {
    switchCase();
}