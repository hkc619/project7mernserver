const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").userModel;
const jwt = require("jsonwebtoken");
const Course = require("../models/course-model");

router.use((req, res, next) => {
  console.log("A request in comming in.");
  next();
});

router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "Test API is working.",
  };
  return res.json(msgObj);
});

router.post("/register", async (req, res) => {
  //check validation of data
  console.log("Register!");
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //check the user exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send("Email has already been registered.");

  //register new user
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      msg: "Register success.",
      saveObject: savedUser,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send("Register fail.");
  }
});

router.post("/login", (req, res) => {
  //check validation of data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).send("User not found.");
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (err) {
            console.log(err);
            return res.status(400).send(err);
          }
          if (isMatch) {
            const tokenObject = { _id: user._id, email: user.email };
            const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
            console.log("token");
            return res.send({ success: true, token: "JWT " + token, user });
          } else {
            res.status(401).send("Wrong password.");
          }
        });
      }
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

module.exports = router;
