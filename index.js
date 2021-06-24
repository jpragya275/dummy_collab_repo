const cors = require("cors");
const express = require("express");
const bodyparser = require("body-parser");
const passport = require("passport");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const productRouter = require("./routes/productRouter")

// Bring in the app constants
const { DB, PORT } = require("./config");

//initialise the application
const app = express();

//Middlewares
app.use(cors());
app.use(bodyparser.json());
app.use(passport.initialize());

require("./middlewares/passport")(passport);

//User Router Middlewares
app.use("/api/users", require("./routes/users"));
app.use("/api/v1/products", productRouter);

const startApp = async () => {
  try {
    //connection with DB
    await connect(DB, {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    success({
      message: `Sucessfully connected to the database\n ${DB}`,
      badge: true,
    });

    //start listening for the server on PORT

    app.listen(PORT, () => {
      success({ message: `Server started on PORT ${PORT}`, badge: true });
    });
  } catch (err) {
    error({
      message: `Unable to connect with Database\n ${err}`,
      badge: true,
    });
    startApp();
  }
};

startApp();
