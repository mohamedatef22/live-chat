const express = require("express");
const router = express.Router();
const Rate = require("../modules/rate");
const auth = require("../middleware/auth");
const User = require("../modules/user");

router.get("/rate/:id", auth, async (req, res) => {
  try {
    const rate = await Rate.findById(req.params.id);
    if (!rate) {
      res.status(400).send({
        status: "4",
        data: {},
        msg: "not found",
      });
      return;
    }
    /* required auth for manager */
    const user = await User.findById(rate.userID);
    if (user.manager_id.toString() != req.data._id.toString()) {
      res.status(400).send({
        status: "4",
        data: {},
        msg: "not autharized to get this rate",
      });
      return;
    }
    res.status(200).send({
      status: "2",
      data: rate,
      msg: "rate ritrived successfuly",
    });
    return;
  } catch (e) {
    res.status(500).send({
      status: "5",
      data: {},
      msg: "faild to get rate",
    });
    return;
  }
});

router.post('/rate/:id',async(req,res)=>{
    try {
        
    } catch (e) {
        
    }
})

module.exports = router;
