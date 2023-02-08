const jwt = require("jsonwebtoken")
const Admin = require("../model/admin")
const auth = async (req, resp, next) => {
    const token = req.cookies.jwt;

    try {

        const adminInfo = await jwt.verify(token, process.env.SKEY);

        const admin = await Admin.findOne({ _id: adminInfo._id })




        req.token = token
        req.admin = admin;

        next();


    } catch (error) {
        resp.render("adminlogin", { msg: "Please login first" })
    }

}


module.exports = auth