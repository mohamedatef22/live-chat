const mongoose = require('mongoose')
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
    const User = require('./user')
    const emps = await User.deleteMany({'company_id':company._id})
    const manager = await User.findById(company.manager_id)
    for(let i=manager.employees.length-1;i>=0;i--){
      if(manager.employees[i].company_id.toString() == company._id.toString()){
        manager.employees.splice(i, 1);
      }
    }
    await manager.save()
    next()
})



const Company = mongoose.model('Company',companySchema)
module.exports=Company