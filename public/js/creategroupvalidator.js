function validate(){
	var form = document.forms["newGroup"];
	var errorList = [];
	if(form["groupname"].value === "")
		errorList.push('Group name is missing');
	var errorString = '';
	if(errorList.length == 0)
		return true;
	errorList.forEach(function(err){
		errorString += err + '\n';
	});
	alert(errorString);
	return false;
};
