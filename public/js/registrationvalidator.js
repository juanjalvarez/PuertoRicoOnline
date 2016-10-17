function validate(){
	var form = document.forms["register"];
	var errorList = [];
	if(form["username"].value === "")
		errorList.push('Username is missing');
	if(form["password"].value === "")
		errorList.push('Password is missing');
	if(form["password"].value !== form["passwordrepeat"].value)
		errorList.push('Passwords do not match');
	var errorString = '';
	if(errorList.length == 0)
		return true;
	errorList.forEach(function(err){
		errorString += err + '\n';
	});
	alert(errorString);
	return false;
};
