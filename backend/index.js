const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const database = require("./config/db")

const PORT=process.env.PORT || 6000;


app.use('/api/analytics', require('./routes/analytics'));

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))