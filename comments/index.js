const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto')
const cors = require('cors');
const axios = require('axios')

const app = express();
app.use(cors())
app.use(bodyParser.json())

const commentsByPostId = [];

app.get('/posts/:id/comments', ( req, res ) => {
    res.send(commentsByPostId[req.params.id] || []);
})

app.post('/posts/:id/comments', ( req, res ) => {
    const { comment } = req.body;
    const { id } = req.params
    const commentId = randomBytes(4).toString('hex');
    const comments = commentsByPostId[id] || [];
    comments.push({
        commentId, comment
    })

    axios.post('http://localhost:4003/events', {
        type: "CommentCreated",
        data : {
            id: commentId,
            comment,
            postId: id
        }
    })
    commentsByPostId[id] = comments;
    res.status(200).send(commentsByPostId[id])
})

app.post('/events', ( req, res ) => {
    console.log(req.body.type, " recevied")
})

app.listen(4001, (req, res)=>{
    console.log("Comments are listening on port 4001")
})

