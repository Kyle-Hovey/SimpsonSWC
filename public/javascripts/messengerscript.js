var socket = io('//localhost:3000');
socket.on("chat", addMessage);

$(() => {
        $("#send").click(() => {
            var chatMessage = {
                chat: $("#chat"), author: $("#author").val(), message: $("#txtMessage").val(), recipient : $('#recipient').val()
            }
            postChat(chatMessage)
        })
    }
)

$(document).ready(
    function getChats() {
        $.get('/messenger/chats', (chats) => {
            chats.forEach(console.log(chat));
        })
    }
)

    function postChat(chat){
        console.log(chat)
        $.post('/messenger/chats', chat)
    }

    function addMessage(chatObj) {
        $('#messages').append(`<h5>${chatObj.author.name} </h5><p>${chatObj.message}</p>`);
    }