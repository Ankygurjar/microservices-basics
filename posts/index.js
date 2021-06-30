const express = require('express');
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const posts = {};

app.get('/posts', ( req, res ) => {
    res.send(posts)
})

app.post('/posts', ( req, res ) => {
    const id = randomBytes(4).toString('hex');
    const {title} = req.body
    posts[id] = {
        id, 
        title
    } 

    axios.post('http://localhost:4003/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    })

    res.status(200).send(posts[id])
})

app.post('/events', ( req, res ) => {
    console.log(req.body.type, " recevied")
})

app.listen(4000, ( req, res )=>{
    console.log("Posts are running on port : ", 4000);
})