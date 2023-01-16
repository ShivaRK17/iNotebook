const connectToMongo = require('./db')
const express = require('express')
const app = express();
const port = 5000;
const cors = require('cors')

connectToMongo();
app.use(cors())
app.use(express.json())

//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port,()=>{
    console.log("Listening to port at 5000");
})