function validate(){
	var form = document.forms["login"];
	var errorList = [];
	if(form["username"].value === "")
		errorList.push('Username field is empty');
	if(form["password"].value === "")
		errorList.push('Password field is empty');
	var errorString = '';
	if(errorList.length == 0)
		return true;
	errorList.forEach(function(err){
		errorString += err + '\n';
	});
	alert(errorString);
	return false;
};
