var fs = require('fs');
var usersFile = 'users.json';
var users = {};

function add(uid, trusted)
{
	users = get();
	users[uid] = trusted;
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




exports.add = add;
exports.get = get;
