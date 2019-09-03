const express = require('express');

const postsRoutes = require('./posts/postRoutes.js');

const server = express();
server.use(express.json());

server.use('/api/posts', postsRoutes);

server.use('/', (req, res) => {
    res.status(200).send('Hello from express');
});

const port = 6000;
server.listen(port, () => {console.log(`\n API on port ${port} \n`)});



