const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({limit: "10mb"}));

const foodchainRouter = require('./route/foodchain.js');

app.use('/foodchain', foodchainRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});