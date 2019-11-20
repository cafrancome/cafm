var bodyParser = require('body-parser'),
    http = require('http'),
    express = require('express'),
    chat = require('./Chat/index'),
    socketio = require('socket.io')(app)


var port = port = process.env.port || 3000,
    app = express(),
    Server = http.createServer(app)

app.use(bodyParser.json())
app.use('/chat',chat)
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

Server.listen(port,() => {
    console.log("El servidor esta ejecutandose en el puerto: " + port)
})

socketio.on('connection', function(socket) {
    console.log('New user connected, socket: ' + socketio.id)

    socket.on('userJoin', function(user) {
        // Escuchar el evento user join, para agregar para agregar un usuario a los otros sockets
        socket.user = user
        socket.broadcast.emit('userJoin', user)
    })

    socket.on('message', function(message) {
        //Escuchar evento message, para emitirlo a otros sockets
        socket.broadcast.emit('message', message)
    })

    socket.on('disconnect', function() {
        //Escuchar el evento de dexconexion para eliminar el usario 
        if(socket.hasOwnProperty('user')) {
            deleteUser(socket.user, function(err,confirm){
                if(err) throw err
            })
        }
    })

})

