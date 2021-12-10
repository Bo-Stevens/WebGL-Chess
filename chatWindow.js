var chatWindow = document.getElementById("chatTextBox")
var chatText = document.getElementById("chatText")
var chatTextUL = document.getElementById("chatTextUL")
//var socket = io();

function sendMessage(){
    if(chatWindow.value != ""){
        socket.emit("send-message", "Player " + (playerNum + 1) + ": " + chatWindow.value)
        addMessageToUI("Me : " + chatWindow.value)
    }

    chatText.scrollTo(0,chatText.scrollHeight)
}

function addMessageToUI(message){
    var message = message
    var li = document.createElement("li")
    li.innerHTML = message
    li.setAttribute("list-style-type", "none")
    chatTextUL.appendChild(li)
    chatWindow.value = ""
}

function keyDown(event){
    if(event.keyCode == 13){
        sendMessage()
    }
}

socket.on("receive-message", message =>{
    addMessageToUI(message)
})



//chatWindow.onblur = sendMessage
chatWindow.onkeydown = keyDown