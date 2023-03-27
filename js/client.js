const socket=io();

const form=document.getElementById('send-container');

const msgin=document.getElementById("msgin");

const msgcontainer=document.querySelector(".container");

//Audio that will play on receiving messages
var audio = new Audio("ding.mp3");

//Ask new user's name while joining
let name;

do 
{
    name = prompt("Enter your name to join ");
} 
while(!name);

//Function which will append event into the container
const append=(message,position)=>
{
    if(message=="")
    {
        return;
    }
    const msgElement = document.createElement('div');
    msgElement.classList.add('msg');
    msgElement.classList.add(position);
    var markup;
    if(position=='left' || position=='mid')
    {
        audio.play();
    }

    if(position=='right')
    {
        markup = `
        <h4>You</h4>
        <p>${message}</p>
    `
    }
    else if(position=='left')
    {
        markup = `
        <h4>${message.name}</h4>
        <p>${message.message}</p>
    `
    }
    else
    {
        markup = `
        <p>${message}</p>
    `
    }

    
    msgElement.innerHTML = markup;
    msgcontainer.append(msgElement);
    
}

socket.emit('new-user-joinedd',name);

//When new user joins, receive the event from the server
socket.on('user-joinedd',name =>
{
    append(`"${name}" joined the chat`,"mid");
    scrollToBottom();
})

//when user receives messages
socket.on('receivee',data =>
{
    append(data,'left');
    scrollToBottom();
})

//When any user left the chat, append info to the container
socket.on('leavee',name =>
{
    append(`"${name}" left the chat`,'mid');
    scrollToBottom();
});

// if form is submitted, sends event to server
form.addEventListener('submit',(e)=>
{
    e.preventDefault();
    const msg=msgin.value;
    append(msg,"right");

    socket.emit('sendd',msg);
    msgin.value="";
    scrollToBottom();
})

function scrollToBottom() 
{
    msgcontainer.scrollTop = msgcontainer.scrollHeight;
}
