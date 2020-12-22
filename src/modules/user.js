const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const Company = require('./company')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true,
        minLength:5,
        maxLength:20,
        validate(value){
            if(!validator.isAlpha(value,'en-US')) throw new Error('Name must contain english')
        }
    },
    userName:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        minlength:4,
        maxlength:15,
        validate(value){
            if(!validator.isAlphanumeric(value,'en-US')) throw new Error('User Name must contain letter and numbers only')
        }
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Wrong email')
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            //
        }
    },
    type:{
        type:Boolean,
        default:false, //false to employee true to manager       
    },
    workingHour:{
        type:Number,
        default:0,
    },
    rate:[{
        rate:{
            type:Number,
            validate(value){
                if(!validator.isInt(value,{ min: 0, max: 5 })) throw new Error('rate must be between 0 and 5')
            }   
        },
    }],
    status:{
        type:Boolean,
        default:false,
    },
    available:{
        type:Boolean
    },
    tokens:[{
        token:{
            type:String
        }
    }],
    manager_id:{
        type:mongoose.Types.ObjectId
    },
    employees:[{
        employee_id:{
            type:mongoose.Types.ObjectId
        }
    }
    ],
    company_id:{
        type:mongoose.Types.ObjectId,
        ref:'Company'
    }
})
userSchema.virtual('Company',{
    ref:'Company',localField:'_id', foreignField:'manager_id'
})

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = bcrypt.hash(user.password,12)
    }
    next()
})

userSchema.pre('remove',async function(next){
    const user = this
    await Company.deleteMany({manager_id:user._id})
    next()
})
userSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.password
    delete user.tokens
    return user
}

userSchema.statics.login = async (user,password)=>{
    if(validator.isEmail(user)){
        const _user = await User.findOne({email:user})
        if(!_user) throw new Error('wrong email')
        const matched = await bcrypt.compare(password, _user.pass)
        if(!matched) throw new Error('wrong password')
        return _user
    }
}

userSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()},'MyNameIsM')
    user.tokens.push({token})
    await user.save()
    return token
}

// userSchema.methods.addEmployee = async function(employee,company_id){
//     const emp = new User(employee)
//     // emp.company_id = company_id
//     // await emp.save()
//     // this.employees.push({employee_id:emp._id})
//     return emp
// }

const User = mongoose.model('User',userSchema)
module.exports=User