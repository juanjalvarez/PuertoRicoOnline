var socket = io();

socket.on('messageReceive', function(data){
	$('#chatView').append("<li class=\"message " + (username === data.author ? 'message-self' : '') + " \">" + (username === data.author ? 'You: ' : data.author + ': ') + data.message + "</li>");
	scrollChatView();
});

var username = null;
socket.on('receiveUsername', function(un){
	username = un;
});
socket.emit('requestUsername');

function sendMessage(){
	var msg = $('#sendMessage').val();
	if(msg === '')
		return false;
	socket.emit('message', msg);
	console.log('sending message ' + $('#sendMessage').val());
	$('#sendMessage').val('');
	return false;
}

function scrollChatView(){
	var element = document.getElementById('chatView');
	element.scrollTop = element.scrollHeight;
}

$('#sendButton').click(function(){
	return sendMessage();
});

$('#sendMessage').keypress(function (e) {
	if (e.which == 13)
		return sendMessage();
	return true;
});
