var fs = require('fs');

function mergeValues(values, content) {
	//cycle over values keys
	for (key in values) {
		if (values.hasOwnProperty(key)) {
			content = content.replace("{{" + key + "}}", values[key]);
		}
	}
		//replace all {{key}} with values[key]

	//return merged content
	return content
}

//Function that handles the reading of files (templates) and merge in values
function view(templateName, values, response) {
	//read from template files and get a string
	var fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: 'utf8'});

	//insert values into the content
	fileContents = mergeValues(values, fileContents);

	//write out to the response
	response.write(fileContents);
}

module.exports.view = view;
