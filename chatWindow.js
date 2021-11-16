var chatWindow = document.getElementById("chatTextBox")
var chatText = document.getElementById("chatText")
var chatTextUL = document.getElementById("chatTextUL")

function sendMessage(){
    if(chatWindow.value != ""){
        var message = "Player 1: " + chatWindow.value
        var li = document.createElement("li")
        li.innerHTML = message
        li.setAttribute("list-style-type", "none")
        chatTextUL.appendChild(li)
        chatWindow.value = ""
    }

    chatText.scrollTo(0,chatText.scrollHeight)
}

function keyDown(event){
    if(event.keyCode == 13){
        sendMessage()
    }
}



//chatWindow.onblur = sendMessage
chatWindow.onkeydown = keyDown