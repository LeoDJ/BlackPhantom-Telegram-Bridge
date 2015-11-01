var https = require('https'); // TEST
var users = require('./users.js');
var fs = require('fs');
var lastIDfile = 'lastID.txt';

var HOST = "chat.nerdmind.de" /*"localhost"*/; // TEST
var LOGIN_PATH =        "/api/authentication.php";
var GET_LAST_MESSAGES_PATH = "/api/loadLastMessages.php";
var GET_MESSAGES_PATH = "/api/loadMessages.php";
var SEND_MESSAGE_PATH = "/api/sendMessage.php";
var GET_USERS_PATH =    "/api/onlineusers.php";

var cookies = "";
var lastID = 0;

function login(user, pass, refreshInterval, bot)
{
	

	var data = 'username=' + user + '&password=' + pass;


	var options = {
		host: HOST,
		path: LOGIN_PATH,
		method: 'POST',
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': data.length
		}
	};

	
	var req = https.request(options, function(response){
	    cookies = (response.headers["set-cookie"]) ? response.headers["set-cookie"][0].split(';')[0] : "";
	    console.log("COOKIES::::",cookies);
	    /*logResponse(response, function(data) { 
			getMsgs();
		});*/
	});

	req.on('error', function(e) {
	    console.log('problem with request: ' + e.message);
	});

	req.write(data);
	req.end();

	setInterval(tick, refreshInterval, bot);

}

function tick(bot)
{
	getMsgs(bot, processMsgs);
}

function getMsgs(bot, callback)
{
	
	var options = {
		host: HOST,
		path: GET_MESSAGES_PATH,
		method: 'POST',
		headers: {
		'Cookie': cookies,
		'Content-Type': 'application/x-www-form-urlencoded'
		}
	};

	var req = https.request(options, function(res) {
	    /*logResponse(res, function(data){
			console.log("Done");
	  	});*/
		var data = "";
		res.on('data', function (chunk) {
	        //console.log('BODY: ' + chunk);
			data += chunk;
	    });
	    res.on('end', function() {
			data = JSON.parse(data);
			callback(bot, data.payload);
		});
	});
	req.on('error', function(e) {
	  console.error(e);
	});
	
	//req.write("limit=200");
	lastID = getLastID();
	req.write("lastID="+lastID);
	req.end();
}

function logResponse(response, callback)
{
	console.log(response.statusCode);
    console.log('HEADERS: ' + JSON.stringify(response.headers));

    //console.log('COOKIES: ' + response.headers["set-cookie"]);
    response.setEncoding('utf8');

	var data = "";
    response.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
		data += chunk;
    });
    response.on('end', function() {
		callback(data);
	});
}

function getLastID()
{
	try
	{
		return parseInt(fs.readFileSync(lastIDfile, 'utf8'));
	}
	catch(e)
	{
		console.log(e);
		return 0;
	}
}

function saveLastID(id)
{
	fs.writeFile(lastIDfile, id, function(err) {
	    if(err)
	      console.log(err);
	});
}

function processMsgs(bot, msgs)
{
	if(msgs != null)
	{
		msgCount = Object.keys(msgs).length;
		//console.log("Length:",msgCount);
		var curID = parseInt(Object.keys(msgs)[msgCount-1]);
		//console.log("CurID:::: "+curID);
		var lastID = getLastID();
	
		if (lastID < curID)
		{
			var newMsgs = [];
			for(var i = lastID+1; i <= curID; i++)
			{
				console.log("[BP Message]", msgs[i][0],msgs[i][2]);
				if(msgs[i][0] === "BOT")
				{
					//console.log("Detected 'BOT'");
					msgs[i][0] = msgs[i][2].substr(0, msgs[i][2].indexOf(":")) + " [via BOT]";
					msgs[i][2] = msgs[i][2].substr(msgs[i][2].indexOf(":")+2);
				}
				
				newMsgs.push(msgs[i]);
			}
			newMessages(newMsgs, bot);
			saveLastID(curID);
		}
	}
	
}


function newMessages(msgs, bot)
{
	var usrs = users.get();
	Object.keys(usrs).forEach(function(key){
		if(usrs[key]["trusted"])
			sendNewMessages(msgs, 0, key, bot);
	});
}

function sendNewMessages(msgs, id, userID, bot)
{
	if(id == msgs.length) return;
	var msg = msgs[id][0] + ":\n"+msgs[id][2];
	if(msgs[id][0] === users.getName(userID) + " [via BOT]")
	{
		sendNewMessages(msgs, id+1, userID, bot);
		return;
	}
	bot.api.sendMessage(userID, msg).then(function(){ 
		sendNewMessages(msgs, id+1, userID, bot);
	});
}



function sendMsg(name, msg)
{
	//send message to bp chat
	//wip
	//console.log("sendMsg(",name,msg,")");
	
	var options = {
		host: HOST,
		path: SEND_MESSAGE_PATH,
		method: 'POST',
		headers: {
		'Cookie': cookies,
		'Content-Type': 'application/x-www-form-urlencoded'
		}
	};

	var req = https.request(options, function(res) {
	  /*logResponse(res, function(data){
		var json_data = JSON.parse(data);
		console.log("Done");
	  });*/
		/*var data = "";
		res.on('data', function (chunk) {
	        //console.log('BODY: ' + chunk);
			data += chunk;
	    });
	    res.on('end', function() {
			data = JSON.parse(data);
		});*/
	});

	req.on('error', function(e) {
	  console.error(e);
	});
	
	req.write("body="+encodeURIComponent(name + ": " + msg));
	
	req.end();
	//console.log("Sending msg","body="+encodeURIComponent(name + ": " + msg));
}

function testLogin(user, pass)
{
	//todo
}

exports.login = login;
exports.sendMsg = sendMsg;
