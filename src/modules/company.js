const mongoose = require('mongoose')



const companySchema = new mongoose.Schema()





const Company = mongoose.model('Company',companySchema)
module.exports=Company