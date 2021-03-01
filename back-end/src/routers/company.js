const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Company = require("../modules/company");
const Chat = require('../modules/chat')

module.exports = function(io){
  ///  tested: add company , auth for only manager can create  company /// 
  router.post("/c/add", auth, async (req, res) => {
    try {
      if (!req.data.type) {
        res.status(400).send({
          status: "4",
          data: {},
          msg: "not allowed to create company",
        });
        return;
      }
      const comp = new Company({
        ...req.body,
        manager_id: req.data._id,
      });
      await comp.save();
      res.status(200).send({
        status: "2",
        data: comp,
        msg: "company created successfuly",
      });
      return;
    } catch (e) {
      res.status(500).send({
        status: "5",
        data: e,
        msg: "company created failed",
      });
      return;
    }
  });
  
  // router.get('/c/connect/:id',auth,async (req,res)=>{
  //   try {
  //     const id = req.params.id
  //     if(req.data.company_id.toString() != id){
  //       res.status(401).send({
  //         status:'4',
  //         data:{},
  //         msg:'Not Authorized'
  //       })
  //       return
  //     }
  //     const connectMe = io.of(`/connectMe/${id}`);
  //     connectMe.on('connection', (socket) => {
  //       console.log('user connected');
  //       socket.join(`room${id}`);
  //     })
  //     res.status(200).send({
  //       status:'1'
  //     })
  //     return
  //   } catch (e) {
  //     res.status(500).send({
  //       status:'5',
  //       data:e,
  //       msg:'Error'
  //     })
  //     return
  //   }
  // })
  /// tested: view company , auth for only owner to view company /** required return employess and their number */ /// 
  router.get("/c/view/:id", auth, async (req, res) => {
    try {
      const comp = await Company.findById(req.params.id);
      if (!comp) {
        res.status(404).send({
          status: "2",
          data: {},
          msg: "not found",
        });
        return;
      }
      if (comp.manager_id.toString() != req.data._id) {
        res.status(400).send({
          status: "4",
          data: {},
          msg: "not authorized to view this company",
        });
        return;
      }
      let emp = [] ; 
      req.data.employees.forEach(element => {
        if(element.company_id.toString() == comp._id.toString()) emp.push(element)
      })
      res.status(200).send({
        status: "2",
        data: {company:comp,employess:emp},
        msg: "company retrived successfuly",
      });
      return;
    } catch (e) {
      res.status(500).send({
        status: "5",
        data: e,
        msg: "failed to get company",
      });
      return;
    }
  });
  
  /// tested : get the first customer in the queue and start chat /// /// required if he is chating don't get another customer
  router.post("/c/e/live/:id", auth, async (req, res) => {
    try {
      if (req.data.company_id.toString() != req.params.id) {
        res.status(400).send({
          status: "4",
          data: {},
          msg: "not allowed to get this company",
        });
        return;
      }
      const company = await Company.findById(req.params.id);
      const visitor = await company.customers.shift();
      await company.save()
      const chat = await Chat.findById(visitor.chat_id)
      if(!chat){
        res.status(400).send({
          status: "4",
          data: {},
          msg: "not found",
        });
        return
      }
      chat.employee_id = req.data._id
      chat.employeeSocketId = req.body.socketId
      console.log(req.body.socketId);
      chat.start_time = new Date();
      await chat.save()
      io.of('/connectMe').to(chat.customerSocketId).emit('chat-started',{message:'started',employeeSocketId:chat.employee_id})
      res.status(200).send({
        status: "2",
        data: [visitor,chat],
        msg: "chat started",
      });
      return
    } catch (e) {
      res.status(500).send({
        status: "5",
        data: e,
        msg: "failed",
      });
      return 
    }
  });
  
  /// tested : add customer when visit company link /// 
  router.post("/c/c/live/:id", async (req, res) => {
    try {
      const company = await Company.findById(req.params.id);
      if (!company) {
        res.status(400).send({
          status: "4",
          data: {},
          msg: "not found",
        }); 
        return;
      }
      const chat = await new Chat({customerSocketId:req.body.customerSocketId})
      await chat.save()
      await company.customers.push({
        ...req.body,
        chat_id:chat._id
      });
      await company.save();
      res.status(200).send({
        status: "2",
        data: [chat],
        msg: "successfuly added",
      });
    } catch (e) {
      res.status(500).send({
        status: "5",
        data: e,
        msg: "failed",
      });
      return
    }
  });
  
  router.get('/c/all',auth,async(req,res)=>{
    try {
      const comp = await Company.find({manager_id:req.data._id});
      res.status(200).send({
        status: "2",
        data: comp,
        msg: "company retrived successfuly",
      });
      return;
    } catch (e) {
      res.status(500).send({
        status: "5",
        data: {},
        msg: "failed to get company",
      });
      return;
    }  
  })
  /// required delete company 
  router.delete("/c/delete/:id", auth, async (req, res) => {
    try {
      const comp = await Company.findById(req.params.id);
      if (!comp) {
        res.status(404).send({
          status: "2",
          data: {},
          msg: "not found",
        });
        return;
      }
      if (comp.manager_id.toString() != req.data._id) {
        res.status(400).send({
          status: "4",
          data: {},
          msg: "not authorized to delete this company",
        });
        return;
      }
      await comp.remove()
      res.status(200).send({
        status: "2",
        data: {},
        msg: "company deleted successfuly",
      });
      return;
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "5",
        data: e,
        msg: "failed to delete company",
      });
      return;
    }
  });

  return router
}
// router;
