const router = require("express").Router();
const apiRoutes = require("./api-routes");
const publicApi = require("./public-api")

// sentiment routes
router.use("/sentiment", apiRoutes);

router.use("/public", publicApi)
module.exports = router;