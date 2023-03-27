//Node server which will handle socket io connections
const express = require('express');
const app=express();
const http=require('http').createServer(app);
const port=process.env.PORT || 8000;


http.listen(port,()=>
{
    console.log(`Listening on port ${port}`);
})

app.use(express.static(__dirname + '/js'));

app.get('/',(req,res)=>
{
    res.sendFile(__dirname + '/index.html')
});

const io = require('socket.io')(http);

const users={};

io.on('connection',socket =>
{
    //If any new user joins, let other users connected to the server know!
    socket.on('new-user-joinedd',name =>
    {
        // console.log("New user joined",name);
        users[socket.id]=name;
        socket.broadcast.emit('user-joinedd',name);
    });

    //if someone sends a message, broadcast it to other people
    socket.on('sendd',message=>
    {
        socket.broadcast.emit('receivee',{message:message,name:users[socket.id]});
    });

    //if someone leaves the server, broadcast it to other peopl
    socket.on('disconnect',message =>
    {
        socket.broadcast.emit('leavee',users[socket.id]);
        delete users[socket.id];
    });

})

