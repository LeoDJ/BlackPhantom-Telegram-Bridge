"use strict";
var bot = require('./bot.js');
var bpBot = require('./bpBotHandler.js');
var bpChat = require('./bpChat.js');
var users = require('./users.js');
var config = require('./config.js');


console.log("Blackphantom Telegram Bot starting...");

var myBot = new bot.Bot(config.auth_token, bpBot.bpBotHandler);
bpChat.login(config.bpUser, config.bpPass, 2500, myBot);