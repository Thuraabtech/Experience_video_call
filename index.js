const app = require("express")();
const server = require("http").createServer(app);
//const { log } = require("console");
const cors = require("cors");// it is used for cross communication btw different servers
//const { Socket } = require("dgram");

// main part is socket.io which facilitates in bidirectional
// communication btw client and server

// it has two parameters one is the server and the other 
// is an object containig options
const io= require("socket.io")(server,{

    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});
app.use(cors());//app to use cors

const PORT = process.env.PORT || 3000;// this means it can be either dynamic port or localhost :3000 port

app.get("/",(req,res)=>{
    res.send("server is running.")
});
// the code below is the backend of our video call website
io.on('connection',(socket)=>{
    //code below is used when the user enters the website
    socket.emit('me',socket.id);
    //code below is used when the call is disconnected
    socket.on('disconnect',()=>{
        socket.broadcast.emit('callended');
    });
    //code below is used when the user makes a call
    socket.on('calluser',({userToCall,signalData,from,name})=>{
        io.to(userToCall).emit("calluser",{signal: signalData,from,name});
    });
    //code below is used when user answers the call
    socket.on("answercall",(data)=>{
        io.to(data.to).emit("callaccepted",data.signal);
    });
}); 
server.listen(PORT,() => console.log(`server listening on port ${PORT}`));