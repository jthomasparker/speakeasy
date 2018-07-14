const router = require("express").Router();
const authRoutes = require("./auth-routes");

router.use(authRoutes)

/*router.use('/login', (req, res)=>{
console.log(req.body)
res.json(req.body)
})*/

module.exports = router;