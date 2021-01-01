const mongoose = require('mongoose')



const Chat = mongoose.model('Chat',{
    employee_id:{
        type:mongoose.Types.ObjectId
    },
    start_time:{
        type:Date,
    },
    end_time:{
        type:Date
    },
    rating:{
        type:Number,
        min:0,
        max:5
    },
    messages:[
        {
            message:{
                type:String,
                required:true
            },
            sender:{
                type:Boolean // true for employee 
            }
        }
    ],
    reported:{
        type:Boolean
    }
})

module.exports=Chat