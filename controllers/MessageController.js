var express = require('express');
var Chat = require('../models/chat');
var Character = require('../models/character');
var Account = require('../models/account');

var messageController = {};

messageController.index = function(req, res) {
	if (req.user) {
        Account.findById(req.user._id).populate('roles').exec(function(err, user){
            Character.findById(req.params.id).populate('contact').exec(function(err, character){
                Character.find({characterType : {$in:['proxy', 'wildcard']}}).exec(function(err, directory){
                    Chat.find({creator : req.params.id, recipient : req.params.id}).populate('creator').populate('recipient').exec(function(err, chats){
                        console.log(user);
                        res.render('messenger', {user : user, character : character, chats : chats, directory : directory});
                    });
                });
            });
        });
    } else {
        res.redirect('../login');
    }
};

messageController.newChat = function(req, res) {
    if (req.user) {
        Account.findById(req.user.id).populate('roles').exec(function(err, user){
            Character.findById(req.body.recipient).exec(function(err,recipient) {
                newChat = new Chat;
                newChat.creator = req.params.id;
                newChat.recipient = recipient._id;
                newChat.save(function(err, newChat){
                    console.log(newChat);
                    res.redirect('/messenger/chat/'+req.params.id+'/'+newChat._id);
                })
            })
        })
    }
}

messageController.getChat = function(req, res){
    if (req.user){
        Account.findById(req.user.id).populate('roles').exec(function(err, user){
            Chat.findById(req.params.chatid).populate('creator').populate('recipient').exec(function(err, chat){
                Character.findById(req.params.characterid).exec(function(err, character){
                    res.render('chat', {user : user, chat : chat, character : character});
                });
            });
        });
    }
}

messageController.chats = async (req, res) => {
    try {
        var message = {author : req.body.author, message : req.body.author}
        var chat = Chat.findById(req.body.chat)
        await chat.messages.push(message)
        await chat.save()
        res.sendStatus(200)

        res.io.emit("chat", req.body)

    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
};

messageController.getChats = function(req, res) {
    Chat.find({},'messages').populate({path:'messages.author'}).exec(function (err, messages) {
        res.send(messages);
    });
};

module.exports = messageController;