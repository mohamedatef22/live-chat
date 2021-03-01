const express = require("express");
const router = express.Router();
const Chat = require("../modules/chat");
const User = require("../modules/user");
const auth = require("../middleware/auth");


// router.post("/chat/:id/start", auth, async (req, res) => {
//   try {
//     const chat = await Chat.findById(req.params.id);
//     if (!chat) {
//       res.status(400).send({
//         status: "4",
//         data: {},
//         msg: "not found",
//       });
//       return;
//     }
//     /* required check auth for chating with this user */
//     chat.employee_id = req.data._id;
//     chat.start_time = new Date();
//     await chat.save();
//     res.status(200).send({
//       status: "2",
//       data: chat,
//       msg: "chat started",
//     });
//     return;
//   } catch (e) {
//     res.status(500).send({
//       status: "5",
//       data: e,
//       msg: "can't start chat",
//     });
//     return;
//   }
// });


module.exports = function(io){
  
/// tested: get chat for employee, auth for only employee
router.get("/chat/:id/employee", auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(400).send({
        status: "4",
        data: {},
        msg: "not found",
      });
      return;
    }
    if (req.data._id.toString() != chat.employee_id.toString()) {
      res.status(400).send({
        status: "4",
        data: {},
        msg: "not authrized to get this chat",
      });
      return;
    }
    res.status(200).send({
      status: "2",
      data: chat,
      msg: "chat retriver successfuly",
    });
    return;
  } catch (e) {
    res.status(500).send({
      status: "5",
      data: e,
      msg: "failed to retrive chat",
    });
    return;
  }
});

/// tested: get chat for manager , auth only for the company manager
router.get("/chat/:id/manager", auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(400).send({
        status: "4",
        data: {},
        msg: "not found",
      });
      return;
    }
    const emp = await User.findById(chat.employee_id);
    if (req.data._id.toString() != emp.manager_id.toString()) {
      res.status(400).send({
        status: "4",
        data: {},
        msg: "not authurized to get this chat",
      });
      return;
    }
    res.status(200).send({
      status: "2",
      data: chat,
      msg: "chat retrived successfuly",
    });
    return;
  } catch (e) {
    res.status(500).send({
      status: "5",
      data: e,
      msg: "failed to get chat",
    });
    return;
  }
});

/// tested: send message by employee , auth for only tha employee
router.post("/chat/:id/employee/message", auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(400).send({
        status: "4",
        data: {},
        msg: "chat not found",
      });
      return;
    }
    if (chat.employee_id.toString() != req.data._id.toString()) {
      res.status(400).send({
        status: "4",
        data: {},
        msg: "not allowed to add message to this chat",
      });
      return;
    }
    await chat.messages.push({
      ...req.body,
      sender: true,
    });
    await chat.save();
    console.log(chat.customerSocketId,'emp')
    io.of('/connectMe').to(chat.customerSocketId).emit('new-message',chat.messages)
    res.status(200).send({
      status: "2",
      data: chat,
      msg: "add message successfuly",
    });
    return;
  } catch (e) {
    res.status(500).send({
      status: "5",
      data: e,
      msg: "failed to add message",
    });
    return;
  }
});

/// tested: send message by customer , /** require auth for only customer
router.post("/chat/:id/customer/message", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(400).send({
        status: "4",
        data: {},
        msg: "chat not found",
      });
      return;
    }
    await chat.messages.push({
      ...req.body,
      sender: false,
    });
    console.log(chat.employeeSocketId);
    io.of('/connectMe').to(chat.employeeSocketId).emit('new-message',chat.messages)
    await chat.save();
    res.status(200).send({
      status: "2",
      data: chat,
      msg: "add message successfuly",
    });
    return;
  } catch (e) {
    res.status(500).send({
      status: "5",
      data: e,
      msg: "failed to add message",
    });
    return;
  }
});

/// tested: report chat , /** required auth for only customer
router.post("/chat/:id/report", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(400).send({
        status: "4",
        data: {},
        msg: "not found",
      });
      return;
    }
    chat.reported = req.body.report;
    await chat.save();
    res.status(200).send({
      status: "2",
      data: chat,
      msg: "reported successfuly",
    });
    return;
  } catch (e) {
    res.status(500).send({
      status: "5",
      data: e,
      msg: "failed to report",
    });
    return;
  }
});

/// tested: rate chat by customer , /** required auth for only customer and rate one time only  
router.post("/chat/:id/rate", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(400).send({
        status: "4",
        data: {},
        msg: "not found",
      });
      return;
    }
    chat.rating = req.body.rate;
    await chat.save();
    res.status(200).send({
      status: "2",
      data: chat,
      msg: "rated successfuly",
    });
    return;
  } catch (e) {
    res.status(500).send({
      status: "5",
      data: e,
      msg: "rated failed",
    });
    return;
  }
});

/// tested: ending chat , require auth for both employee and customer and adding to totla hour working 
router.post("/chat/:id/end", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(400).send({
        status: "4",
        data: {},
        msg: "not found",
      });
      return;
    }
    /* required check auth for ending chating */
    chat.end_time = new Date();
    /* required to add this to working hour */
    await chat.save();
    res.status(200).send({
      status: "2",
      data: chat,
      msg: "chat ended",
    });
    return;
  } catch (e) {
    res.status(500).send({
      status: "5",
      data: e,
      msg: "can't end chat",
    });
    return;
  }
});
return router;
}
// router;
