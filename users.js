var fs = require('fs');
var usersFile = 'users.json';
var users = {};

function add(uid, trusted, name)
{
	users = get();
	users[uid] = [trusted, name];
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
		return get()[id][0];
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
		return get()[id][1];
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
		usrs[id][1] = name;
	}
	catch(e)
	{
		console.warn("User",id,"not found");
	}
	saveUsers(usrs);
}



exports.add = add;
exports.get = get;
exports.isTrusted = isTrusted;
exports.getName = getName;
exports.setName = setName;
