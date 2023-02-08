const router = require("express").Router()
const User = require("../model/User")
const Category = require("../model/Category")
//const auth = require("../middleware/auth")
const uauth = require("../middleware/userauth")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Product = require("../model/Product")
const Cart = require("../model/Cart")

router.get("/", async (req, resp) => {
    try {
        const cat = await Category.find();
        const prod = await Product.find()
        resp.render("index", { cdata: cat, pdata: prod })
    } catch (error) {

    }
})

router.get("/cart", uauth, async (req, resp) => {
    const uid = req.user._id
    try {
        const cartdata = await Cart.aggregate([{ $match: { uid: uid } }, { $lookup: { from: 'products', localField: 'pid', foreignField: '_id', as: 'products' } }])
        console.log(cartdata);
        resp.render("shoping-cart", { cartd: cartdata })
    } catch (error) {

    }
    // resp.render("shoping-cart")
})

router.get("/contact", (req, resp) => {
    resp.render("contact")
})

router.get("/shopdetail", (req, resp) => {
    resp.render("shop-details")
})

router.get("/shopgrid", async (req, resp) => {
    try {
        const cat = await Category.find();
        const prod = await Product.find()
        resp.render("shop-grid", { cdata: cat, pdata: prod })
    } catch (error) {

    }
})

router.get("/findByCat", async (req, resp) => {
    const catid = req.query.catid
    try {
        const cat = await Category.find();
        const prod = await Product.find({ cid: catid })
        resp.render("shop-grid", { cdata: cat, pdata: prod })
    } catch (error) {

    }
})

router.get("/loginpage", (req, resp) => {
    resp.render("login")
})
router.get("/reg", (req, resp) => {
    resp.render("registration")
})


router.post("/login", async (req, resp) => {
    try {
        const data = await User.findOne({ email: req.body.email })

        const isvalid = await bcrypt.compare(req.body.password, data.password)
        console.log(isvalid);
        if (isvalid) {

            const token = await data.generateToken();
            resp.cookie("ujwt", token)
            resp.render("index")
        } else {
            resp.render("login", { msg: "Invalid Email or passwrod" })
        }

    } catch (error) {
        resp.render("login", { msg: "Invalid Email or passwrod" })
    }

})




router.post("/userreg", async (req, resp) => {
    try {
        const user = new User(req.body);
        await user.save();
        resp.render("registration", { msg: "Registration success !!!" })
    } catch (error) {
        console.log(error);
    }
})

//**************************cart******************************/

router.get("/addtocart",uauth, async (req, resp) => {
    const pid = req.query.pid
    console.log(pid);
    const uid = req.user._id
    console.log(uid);
    try {
        const cart = new Cart({
            pid: pid,
            uid: uid
        })
        await cart.save();
        resp.send("product added into cart")
    } catch (error) {
        console.log(error);
    }
})



module.exports = router