require('./db/mongoose')
const express = require('express')
const userRoute=require('./routers/user')
const chatRoute=require('./routers/chat')
const companyRoute=require('./routers/company')
const port = process.env.PORT || 3000
const rateRouter = require('./routers/rate')
const app = express()
const cors = require('cors')
app.use(express.json())
// app.use(chatRoute)
app.use(cors())
app.use(userRoute)
app.use(companyRoute)
app.use(rateRouter)
app.use(chatRoute)


app.listen(port,function(){
    console.log(`server running at port ${port}`)
})