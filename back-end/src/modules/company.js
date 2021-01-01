const mongoose = require('mongoose')
const User = require('./user')
const validator = require('validator')

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        minlength:5,
        maxlength:25,
        validate(value){
            if(!validator.isAlpha(value, "en-US")) throw new Error("Name must contain english");
        }
    },
    manager_id:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    },
    // employees:[{
    //     employee_id:{
    //         type:mongoose.Types.ObjectId,
    //     }
    // },{_id:false}],
    customers:[{
        userName:{
            type:String,
            required:true
        },
        chat_id:{
            type:mongoose.Types.ObjectId,
            required:true
        }
    }]

})

companySchema.pre('remove',async function(next){
    const company = this
    company.employees.forEach(async (emp) => {
        await User.findByIdAndDelete(emp.employee_id)
    });
    next()
})



const Company = mongoose.model('Company',companySchema)
module.exports=Company