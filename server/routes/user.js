
const express = require('express');
const userRouter = express.Router()

const ChatRedis = require('../redis')
const config = require('../config')

// config.KEY: We just want to store the logged users (username has to be unique)
// so we always use the same key to adapt it to our Redis implementation

// Login
userRouter.post('/login', (req, res) => {
    const newUser = req.body
    if (!newUser.username) return res.send({ code: 400, message: 'Data is required' })
    console.log(`Login user ${newUser.username}`)

    ChatRedis
        .getUser(newUser.room, newUser.username)
        .then(user => {
            console.log('db select user',user);
            ChatRedis.addUser(newUser.room, newUser.username, newUser)
             console.log(`User ${newUser.username} logged`)
            return res.send({ code: 200, message: 'Logged in succesfully' })
        })
})

// Logout
userRouter.post('/logout', (req, res) => {
    const user = req.body
    console.log(`Logout user ${user.username}`)

    ChatRedis
        .delUser(user.room, user.username)
        .then(data => {
            if (!data)
                return res.send({ code: 400, message: 'User not found' })

            return res.send({ code: 200, message: 'Logged in succesfully' })
        })
})


module.exports = userRouter
