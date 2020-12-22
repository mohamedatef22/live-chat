const jwt = require('jsonwebtoken')
const User = require('../modules/user')

const auth = async function(req,res,next){
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decodedToken = jwt.verify(token,'MyNameIsM')
        const user = await User.findOne({_id:decodedToken._id,'tokens.token':token})
        if(!user) throw new Error('not authrized')
        req.token = token
        req.data = user

    } catch (e) {
        res.status(500).send({
            status:'5',
            data:e,
            msg:"error auth"
        })
        return
    }
    next()
}
module.exports=auth