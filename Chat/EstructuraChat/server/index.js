var bodyParser = require('body-parser'),
    http = require('http'),
    express = require('express'),
    chat = require('./Chat')


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