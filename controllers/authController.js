const bcrypt = require("bcryptjs");
const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
const passport = require("passport");

/*
register  */

const userRegister = async (userDets, role, res) => {
  try {
    //Validate the username
    let usernameNotTaken = await validateUsername(userDets.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: `Username is aldready taken`,
        success: false,
      });
    }

    //validate the email
    let emailNotRegistered = await validateEmail(userDets.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is aldready registered`,
        success: false,
      });
    }

    //Get the hashed password
    const password = await bcrypt.hash(userDets.password, 12);
    //create a new user
    const newUser = new User({
      ...userDets,
      password,
      role,
    });

    await newUser.save();
    return res.status(201).json({
      message: "sucessfull registration",
      success: true,
    });
  } catch (err) {
    //Implement logger function()
    return res.status(500).json({
      message: "Unable to create your account",
      success: false,
    });
  }
};

const userLogin = async (userCreds, role, res) => {
  let { username, password } = userCreds;
  //First Check if the username is in the database
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      message: "username not found. invalid login credentials",
      success: false,
    });
  }
  //we will check the rule
  if (user.role !== role) {
    return res.status(403).json({
      message: "please make sure you are logging in from the right portal",
      success: false,
    });
  }
  //that means user is existing and trying to sign in the right portal
  //now check for the password
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    //sign in the token and issue it to the user
    let token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      SECRET,
      { expiresIn: "7 days" }
    );

    let result = {
      username: user.username,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };

    return res.status(200).json({
      ...result,
      message: "you are logged in",
      sucess: true,
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password",
      success: false,
    });
  }
};
const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

const userAuth = passport.authenticate("jwt", { session: false });

const checkRole = (roles) => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorised")
    : next();

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

const serializeUser = (user) => {
  return {
    username: user.username,
    email: user.email,
    name: user.name,
    _id: user._id,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
};

module.exports = {
  userAuth,
  checkRole,
  userLogin,
  userRegister,
  serializeUser,
};
