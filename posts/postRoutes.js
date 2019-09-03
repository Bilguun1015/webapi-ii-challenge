const express = require('express');

const Posts = require('../data/db.js');

const router = express.Router();

router.post('/', (req, res) => {
const postInfo = req.body;

if(postInfo.title && postInfo.contents){
    Posts.insert(postInfo)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the post to the database" });
        });
} else {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
};
});

router.post('/:id/comments', (req, res) => {
    const{ id } = req.params;
    const commentInfo = req.body;

    Posts.findCommentById(id).then(post => {
        if(post){
            if(commentInfo.text){
                Posts.insertComment(commentInfo)
                    .then(comment => {
                        res.status(201).json(comment);
                    })
                    .catch(error => {
                        res.status(500).json({ error: "There was an error while saving the comment to the database" });
                    })
            } else {
                res.status(400).json({ errorMessage: "Please provide text for the comment." });
            };
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
})

router.get('/', (req, res) => {
    Posts.find().then(posts => {
        res.status(200).json(posts)
    }).catch(error => {
        res.status(500).json({error: "The posts information could not be retrieved."})
    })
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Posts.findById(id).then(post => {
        if(post){
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    }).catch(error => {
        res.status(500).json({ error: "The post information could not be retrieved." });
    })
});

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    Posts.findPostComments(id).then(comment => {
        if(comment){
            res.status(200).json(comment)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    }).catch(error => {
        res.status(500).json({ error: "The comments information could not be retrieved." });
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Posts.remove(id).then(deleted => {
        if(deleted){
            res.status(200).json({message: "Post successfully removed"});
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    }).catch(error => {
        res.status(500).json({ error: "The post could not be removed" })
    });
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    if(changes.title && changes.contents){
        Posts.update(id, changes).then(updated => {
            if(updated){
                res.status(200).json(updated);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        }).catch(error => res.status(500).json({ error: "The post information could not be modified." }));
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
})

module.exports = router;
