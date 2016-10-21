var socket = io();

var username = null;
var group = null;

function appendComment(data){
	$('#messageList').append("<li class=\"list-group-item message " + (username === data.author ? 'message-self' : '') + " \">" + (username === data.author ? 'You: ' : data.author + ': ') + data.message + "</li>");
}

socket.once('receiveUsername', function(un){
	username = un;
	console.log('Local username set to ' + un);
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

$('#sendButton').click(function(){
	return sendMessage();
});

$('#sendMessage').keypress(function (e) {
	if (e.which == 13)
		return sendMessage();
	return true;
});

$('.group-list-link').click(function(){
	socket.emit('requestGroup', this.id);
	socket.once('receiveGroup', function(commentList){

	});
});

function scrollChatView(){
	var element = document.getElementById('messageList');
	element.scrollTop = element.scrollHeight;
}

socket.on('messageReceive', function(data){
	appendComment(data);
	scrollChatView();
});
