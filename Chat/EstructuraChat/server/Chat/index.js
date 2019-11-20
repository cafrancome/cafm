var express = require('express')

var Storage = require('../Storage')

var Router = express.Router()


Router.get('/users', (req, res) => {
    // get Usuario
    Storage.getData('users')
            .then(function(users){
                res.json(users)
            }).catch(function(error) {
                res.sendStatus(500).json(error)
            })
})

Router.get('/messages', (req, res) => {
    // get Usuario
    Storage.getData('messages')
            .then(function(messages){
                res.json(messages)
            }).catch(function(error) {
                res.sendStatus(500).json(error)
            })
})

Router.post('/users', (req, res) => {
    // post message
    var user = res.body.users
    Storage.getData('users')
            .then(function(users){
                return new Promise(function(resolve, reject) {
                    Storage.saveData('users',user,users)
                            .then(function(message){
                                resolve(message)
                            }).catch(function(err){
                                reject(err)
                            })
                })
            }).then(function(message){
                res.json(message)
            }).catch(function(err){
                res.sendStatus(500).json(err)
            })
})

Router.post('/message', (req, res) => {
    // post message
    var message = req.body.Menssage
    Storage.getData('message')
            .then(function(messages){
                return new Promise(function(resolve, reject) {
                    Storage.saveData('users',message,messages)
                            .then(function(message){
                                resolve(message)
                            }).catch(function(err){
                                reject(err)
                            })
                })
            }).then(function(message){
                res.json(message)
            }).catch(function(err){
                res.sendStatus(500).json(err)
            })
})

module.exports = Router

