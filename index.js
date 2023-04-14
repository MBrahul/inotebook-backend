const connectToMongo = require('./db.js');
const express = require('express')
var cors = require('cors')
require('dotenv').config({path:'.env'});

connectToMongo();

const app = express();
app.use(cors());

const PORT = process.env.PORT;


// Avaiable routes
app.use(express.json());// to user res.json()

app.use('/api/auth',require('./routes/auth'));
app.use('/api/note',require('./routes/notes'));


app.get('/', (req, res) => {
  res.send('INOTEBOOK');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})