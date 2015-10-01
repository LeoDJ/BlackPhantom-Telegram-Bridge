var bot = require('./bot.js');
var bpBot = require('./bpBotHandler.js');
var bpChat = require('./bpChat.js');
var users = require('./users.js');
var config = require('./config.js');


//console.log(users.getUsers());

//var users = {123: {name: 'LeoDJ', trusted: true}};


var myBot = new bot.Bot(config.auth_token, bpBot.bpBotHandler);
var myBpChat = new bpChat.login(config.bpUser, config.bpPass, 2500, myBot);

console.log("Blackphantom Telegram Bot starting...");

