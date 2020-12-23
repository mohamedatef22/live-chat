const express = require("express");
const router = express.Router();
const User = require("../modules/user");
const auth = require("../middleware/auth");

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
    user.generateToken();
    res.status(200).send({
      status: "2", // 2 is ok
      data: user,
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

router.post('/login',async (req,res)=>{
    try {
        const user = await User.login(req.body.user,req.body.password)
        if(!user) throw new Error('failed to login')
        user.generateToken()
        res.status(200).send({
            status:"2",
            data:user,
            msg:'loged in successfuly'
        })
        return
    } catch (e) {
        res.status(500).send({
            status:"5",
            data:e,
            msg:'loged in failed'
        })
        return
    }
})

// router.get("/user", auth, async (req, res) => {
//   res.send({
//     token: req.token,
//     data: req.data,
//   });
// });

module.exports = router;


// get employee , edit profile , delete employee