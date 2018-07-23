const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
const authRoutes = require("./auth")
const userRoutes = require("./user")
const jwtExp = require('express-jwt')

// API routes
router.use("/api", apiRoutes);

// Auth routes
router.use("/auth", authRoutes)

// jwt auth middleware
router.use("/braintrain", jwtExp({
  secret: 'random_secret',
  getToken: function fromCookie(req){
      if(req.signedCookies){
          return req.signedCookies.jwtAuthToken
      }
      return null
  },
  credentialsRequired: false
})
)

// user routes
router.use("/braintrain", userRoutes)

// If no API or auth routes are hit, send the React app
router.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;