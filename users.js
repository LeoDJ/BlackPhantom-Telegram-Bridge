var fs = require('fs');
var usersFile = 'users.json';
var users = {};


function add(uid, trusted, name)
{
	users = get();
	users[uid] = {"trusted": trusted, "name": name};
	saveUsers(users);
}


function saveUsers(users)
{
	fs.writeFile(usersFile, JSON.stringify(users, null, 2), function(err) {
    if(err) {
      console.log(err);
    } else {
      //console.log("JSON saved to " + usersFile);
    }
}); 
}

function get()
{
	var file = "{}";
	try
	{
		var file = fs.readFileSync(usersFile, 'utf8');
	}
	catch(e)
	{
		console.log(usersFile + " not found, creating...");
	}
	
	return JSON.parse(file);
}

function isTrusted(id)
{
	try
	{
		return get()[id]["trusted"];
	}
	catch(e)
	{
		return false;
	}
}

function getName(id)
{
	try
	{
		return get()[id]["name"];
	}
	catch(e)
	{
		console.warn("Username of",id,"not found")
		return "";
	}
}

function setName(id, name)
{
	var usrs = get();
	try
	{
		usrs[id]["name"] = name;
	}
	catch(e)
	{
		console.warn("User",id,"not found");
	}
	saveUsers(usrs);
}

function setBpLogin(id, bpName, bpPass)
{
	var usrs = get();
	try
	{
		usrs[id]["bpName"] = bpName;
		usrs[id]["bpPass"] = new Buffer(bpPass).toString('base64');
	}
	catch(e)
	{
		console.warn("User",id,"not found","("+e+")");
		throw new Error(e);
	}
	saveUsers(usrs);
}

function getBpLogin(id)
{
	var usrs = get();
	var login = [];
	try
	{
		login.push(usrs[id]["bpName"]);
		login.push(new Buffer(usrs[id]["bpPass"], 'base64').toString('utf-8'));
		
	}
	catch(e)
	{
		console.warn("User",id,"has no BP login");
		return null;
	}
	return login;
}


exports.add = add;
exports.get = get;
exports.isTrusted = isTrusted;
exports.getName = getName;
exports.setName = setName;
exports.setBpLogin = setBpLogin;
exports.getBpLogin = getBpLogin;
