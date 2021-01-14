const express = require("express");
const router = express.Router();
const User = require("../modules/user");
const auth = require("../middleware/auth");
const Company = require('../modules/company')

/// tested: register manager ///
router.post("/m/register", async (req, res) => {
  // m for manager
  try {
    const userKeys = Object.keys(req.body);
    const allowedRegister = ["name", "userName", "email", "password"];
    const validUpdates = userKeys.every((u) => allowedRegister.includes(u));
    if (!validUpdates) {
      res.status(400).send({
        status: "4", // 4 is not allowed
        data: {},
        msg: "not allowed to register with this property",
      });
      return;
    }
    const user = new User(req.body);
    await user.save();
    const token = await user.generateToken();
    res.status(200).send({
      status: "2", // 2 is ok
      data: user,
      token:token,
      msg: "registered successfuly",
    });
    return;
  } catch (e) {
    res.status(500).send({
      status: "5", // 5 server error
      data: e,
      msg: "failed to register",
    });
    return;
  }
});

/// tested: add employee , auth for manegar that own the company ///
router.post("/m/employee/add", auth, async (req, res) => {
  try {
    const userKeys = Object.keys(req.body);
    const allowedRegister = ["name", "userName", "email", "password","company_id"];
    const validUpdates = allowedRegister.every((u) => userKeys.includes(u));
    if (!validUpdates) {
      res.status(400).send({
        status: "4", // 4 is not allowed
        data: {},
        msg: "not allowed to register with this property",
      });
      return;
    }
    const comp = await Company.findById(req.body.company_id)
    if(!comp){
      res.status(400).send({
        status: "4", // 4 is not allowed
        data: {},
        msg: "no company with this id",
      });
      return;
    }
    if(comp.manager_id.toString() != req.data._id.toString()){
      res.status(400).send({
        status: "4", // 4 is not allowed
        data: {},
        msg: "not allowed to add to this company",
      });
      return;
    }
    const newEmployee = new User(req.body)
    newEmployee.type = false
    newEmployee.workingHour = 0
    newEmployee.available = false
    newEmployee.manager_id = req.data._id
    const manager = await User.findById(req.data._id)
    await newEmployee.save()
    manager.employees.push({employee_id:newEmployee._id,company_id:newEmployee.company_id})
    await manager.save()
    res.status(200).send({
        status:"2",
        data:newEmployee,
        msg:"created successfuly"
    })
    return
  } catch (e) {
    res.status(500).send({
        status:"5",
        data:e,
        msg:"created failed"
    })
    return
  }
});

/// tested: delete manager , auth for only manager ///
router.delete('/m/delete/:id',auth,async (req,res)=>{
  try {
    if(req.data._id.toString() != req.params.id.toString()){
      res.status(400).send({
        status:'4',
        data:{},
        msg:"not allawed to delete this user"
      })
      return
    }
    const user = await User.findById(req.params.id)
    await user.remove()
    res.status(200).send({
      status:'2',
      data:{},
      msg:'deleted successfuly'
    })
    return
  } catch (e) {
    res.status(500).send({
      status:'5',
      data:e,
      msg:'failed to delete'
    })
    return
  }
})

/// tested: view employee , auth for only manager ///
router.get('/m/employee/view/:id',auth,async(req,res)=>{
  try {
    const employee = await User.findById(req.params.id)
    if(!employee){
      res.status(400).send({
        status:'4',
        data:{},
        msg:"this employee not found"
      })
      return
    }
    if(employee.manager_id.toString() != req.data._id.toString()){
      res.status(400).send({
        status:'4',
        data:{},
        msg:'Not allowed to view this user'
      })
      return
    }
    res.status(200).send({
      status:'2',
      data:employee,
      msg:'user retrived successfuly'
    })
    return
  } catch (e) {
    res.status(500).send({
      status:'5',
      data:e,
      msg:'user retrived failed'
    })
    return
  }
})

/// tested: delete employee , auth for only manager ///
router.delete('/m/employee/delete/:id',auth,async(req,res)=>{
  try {
    const employee = await User.findById(req.params.id)
    if(!employee){
      res.status(400).send({
        status:'4',
        data:{},
        msg:"this employee not found"
      })
      return
    }
    if(employee.manager_id.toString() != req.data._id.toString()){
      res.status(400).send({
        status:'4',
        data:{},
        msg:'Not allowed to delete this user'
      })
      return
    }
    await employee.remove()
    res.status(200).send({
      status:'2',
      data:{},
      msg:'user deleted successfuly'
    })
    return
  } catch (e) {
    res.status(500).send({
      status:'5',
      data:e,
      msg:'user deletion failed'
    })
    return
  }
})

/// tested : login , if the status is false the login will failed ///
router.post('/login',async (req,res)=>{
    try {
        const user = await User.login(req.body.user,req.body.password)
        if(!user) throw new Error('failed to login')
        const token = await user.generateToken()
        res.status(200).send({
            status:"2",
            data:user,
            token:token,
            msg:'loged in successfuly'
        })
        return
    } catch (e) {
      console.log(e);
        res.status(500).send({
            status:"5",
            data:e,
            msg:'loged in failed'
        })
        return
    }
})

router.get("/me", auth, async (req, res) => {
  res.status(200).send({
    user:req.data
  });
});

router.get("/logout", auth, async (req, res) => {
  for(let i =0 ;i<req.data.tokens.length;i++){
    if(req.token == req.data.tokens[i].token){
      req.data.tokens.splice(i,1)
      break
    }
  }
  await req.data.save()
  res.status(200).send({
    status:'2',
    data:{},
    msg:'logedout successfuly'
  });
});

router.post('/m/employee/activate/:id',auth,async (req,res)=>{
  try{
    const user = await User.findById(req.params.id)
    if(!user){
      res.status(404).send({
        status:'4',
        data:{},
        msg:'Not found'
      })
      return
    }
    if(req.data._id.toString() != user.manager_id.toString()){
      res.status(402).send({
        status:'4',
        data:{},
        msg:'not Authorized to activate this user'
      })
      return
    }
    if(user.status){
      res.status(400).send({
        status:'4',
        data:{},
        msg:'user already activated'
      })
      return
    }
    user.status = true
    await user.save()
    res.status(200).send({
      status:'2',
      data:user,
      msg:'user successfuly activated'
    })
    return
  }catch(e){
    res.status(500).send({
      status:'5',
      data:e,
      msg:'Faile to activatet user'
    })
    return
  }
})

router.post('/m/employee/deactivate/:id',auth,async (req,res)=>{
  try{
    const user = await User.findById(req.params.id)
    if(!user){
      res.status(404).send({
        status:'4',
        data:{},
        msg:'Not found'
      })
      return
    }
    if(req.data._id.toString() != user.manager_id.toString()){
      res.status(402).send({
        status:'4',
        data:{},
        msg:'not Authorized to activate this user'
      })
      return
    }
    if(!user.status){
      res.status(400).send({
        status:'4',
        data:{},
        msg:'user already deactivated'
      })
      return
    }
    user.status = false
    await user.save()
    res.status(200).send({
      status:'2',
      data:user,
      msg:'user successfuly deactivated'
    })
    return
  }catch(e){
    res.status(500).send({
      status:'5',
      data:e,
      msg:'Faile to activatet user'
    })
    return
  }
})


module.exports = router;


// get employee , edit profile , delete employee