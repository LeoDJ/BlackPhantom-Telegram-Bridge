var users = require('./users.js');
var config = require('./config.js');
var bpChat = require('./bpChat.js');


function bpBotHandler(bot, msg)
{
	logMsg(msg);
	//bot.sendMessage(msg.from.id, msg.text);
	var uid = msg.from.id;
	var cmd = msg.text.split(' ');
	if (cmd[0] == '/auth')
	{
		if (cmd[1] == config.password)
		{
			bot.sendMessage(msg.from.id, "Registrierung erfolgreich!\nBitte lösche die obige Nachricht, damit niemand einfach das Passwort lesen kann.\nDein aktueller Anzeigename ist \""+users.getName(uid)+"\". \nBenutze /setname <name>, um deinen Namen zu ändern.");
			users.add(msg.from.id, true, msg.from.first_name);
		}
		else
		{
			bot.sendMessage(msg.from.id, "Wrong Password");
		}
	}
	else if(cmd[0] == '/setname')
	{
		users.setName(uid, cmd[1]);
		bot.sendMessage(uid, "Name geändert in \"" + cmd[1] + "\".")
	}
	else if (users.isTrusted(msg.from.id))
	{
		var name = users.getName(uid);
		console.log("[Bot > BP Chat]",name, msg.text);
		bpChat.sendMsg(name, msg.text);

	}
}

function logMsg(msg)
{
	/*var id = msg.from.id;
	var uName = msg.from.username ? msg.from.username : "";
	var fName = msg.from.first_name;
	var lName = msg.from.last_name ? " "+msg.from.last_name : "";
	console.log(id + " " + uName + " (" + fName + lName + ") " + (msg.chat.title ? message.chat.title : "private") + " - " + msg.text);
	*/
	console.log(msg.chat.id, msg.from.username ? msg.from.username : msg.from.first_name, msg.text);
}

exports.bpBotHandler = bpBotHandler;