var TelegramBot = require('node-telegram-bot-api');

function Bot(auth_token, handler)
{
	//this.auth_token = auth_token;
	this.api = new TelegramBot(auth_token, {polling: {interval: 250}});
	this.api.on('text', function(msg) {
		handler(this, msg);
	})
}

exports.Bot = Bot;