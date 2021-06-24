const router = require("express").Router();
//Bring in the User Registration function
const {userRegister,userLogin,checkRole,userAuth,serializeUser} = require("../controllers/authController");

//Users Registration Route
router.post("/register-user",async(req,res) => {
    await userRegister(req.body, 'user',res);
});

//Admin Registration Route
router.post("/register-admin",async(req,res) => {
    await userRegister(req.body,"admin",res);
});

//Super Admin Registration Route
router.post("/register-super-admin",async(req,res) => {
    await userRegister(req.body,"superadmin",res);
});

//Users Login Route
router.post("/login-user",async(req,res) => {
    await userLogin(req.body,"user",res);
});

//Admin Login  Route
router.post("/login-admin",async(req,res) => {
    await userLogin(req.body,"admin",res);
});

//Super Admin Login Route
router.post("/login-super-admin",async(req,res) => {
    await userLogin(req.body,"superadmin",res);
});

//Profile Route
router.get("/profile",userAuth,async(req,res) => {
    return res.json(serializeUser(req.user));
});

//Users Protected Route
router.get("/user-protected",userAuth,checkRole(['user']),async(req,res) => { return res.json("hello user")});

//Admin Protected Route
router.get("/admin-protected",userAuth,checkRole(['admin']),async(req,res) => {return res.json("hello admin")});

//Super Admin Protected Route
router.get("/superadmin-protected",userAuth,checkRole(['superadmin']),async(req,res) => {return res.json("super admin")});

router.get("/superadminandadmin-protected",userAuth,checkRole(['superadmin','admin']),async(req,res) => {return res.json("super admin and admin")});

module.exports = router;


