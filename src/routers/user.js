const express = require("express");
const router = express.Router();
const User = require("../modules/user");

router.post("/m/register", async (req, res) => {
  // m for manager
  try {
    const userKeys = Object.keys(req.body);
    const allowedRegister = ["name", "userName", "email", "password", "type"];
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

router.get("/user", async (req, res) => {
  res.send("ok");
});

module.exports = router;
