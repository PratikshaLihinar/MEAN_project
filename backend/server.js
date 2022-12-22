// const http = require('http');   //import form node http package to create own server
// const app = require('./backend/app.js');
// //just cross check it works or not
// // const server = http.createServer((req, res) => {    //create server
// //     res.end('This is my first response');
// // });
// const port=process.env.PORT || 3000;
// app.set('port',port);
// const server=http.createServer(app);
// // server.listen(process.env.PORT || 3000);//listen to the request - the server is running on port no 3000 
// server.listen(port);


//improve code

const app = require('./app');
const http = require('http');
const { debug } = require('console');
//const debug = require("debug")("node-angular");
const normalizePort = val =>{
    var port = parseInt(val, 10);

    if(isNaN(port)){
        //named pipe
        return val;
    }
    if(port >=0){
        //port number
        return port;
    }
    return false;
};

const onError = error =>{
    if(error.svscall !== "listen"){
      throw error; 
    };
    const blind = typeof addr === "string"? "pipe"+addr : "port" + port;
    switch (error.code){
        case "EACCES":
            console.error(bind + "requires elevation privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + "is already in use");
            process.exit(1);
            break;
        default:
            throw error;    
    }
};

const onListening =() =>{
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe" + addr : "port" + port;
    debug("Listening on" + bind);
};
const port = normalizePort(process.env.PORT || "3000");
const server =  http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);