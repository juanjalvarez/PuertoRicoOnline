var db = require('./database');

db.Comment.find({})
.populate('author')
.exec(function(err, c){
	c.forEach(function(comment){
		console.log(comment.author.name);
	});
});
