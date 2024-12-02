const express = require('express')
const mongoose = require('./db/mongoose');
const routers = require('./router/routers')
const cors = require('cors');
const path = require('path');
require("dotenv").config();


const app = express()
const port = process.env.SEARVER_PORT || 3000 

app.use(cors());
app.use(express.json())
app.use("/", express.static(path.join(__dirname, 'public/images')));

app.use(routers)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))