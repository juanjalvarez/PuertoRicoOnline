var socket = io();

var username = null;
var currentGroup = null;

$("#chatView").hide();

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
	var json = {
		message: msg,
		group: currentGroup
	};
	socket.emit('message', json);
	console.log('sending message ' + msg);
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
	$('#messageList').empty();
	currentGroup = $(this).attr('group-id');
	var json = {
		groupid: currentGroup
	};
	console.log(currentGroup);
	socket.emit('requestGroup', json);
	socket.once('receiveGroup', function(json){
		json.commentlist.forEach(function(elem){
			appendComment(elem);
		});
		$("#chatView").show();
		scrollChatView();
	});
});

function scrollChatView(){
	var element = document.getElementById('messageList');
	element.scrollTop = element.scrollHeight;
}

socket.on('messageReceive', function(data){
	if(data.group === currentGroup){
		appendComment(data);
		scrollChatView();
	}
});
