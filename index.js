const express=require('express')
const cors=require('cors')
require('dotenv').config()
require('./config/server')
const userRoute=require('./routes/userRoutes')


const app=express()

app.use(cors())
app.use(express.json())

app.use('/api/auth',userRoute)


const PORT=3000 || process.env.PORT

app.get('/',(req,res)=>{
    res.send('hello world')
})

app.listen(PORT,()=>{
    console.log("server running at",PORT);
    
})