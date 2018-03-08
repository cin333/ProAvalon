//all middleware goes here
var forumThread = require("../models/forumThread");
var forumThreadComment = require("../models/forumThreadComment");


var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		forumThread.findById(req.params.id, function(err, forumThread){
			if(err){
				req.flash("error", "forumThread not found!");
				res.redirect("back");
			} else{
				//does user own campground?
				if(forumThread.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You are not the owner!");
					res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		forumThreadComment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else{
				//does user own campground?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You are not the owner!");
					res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/");
}

module.exports = middlewareObj;