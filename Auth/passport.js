const passport = require("passport")
const jwt = require("passport-jwt").Strategy
const { ExtractJwt } = require("passport-jwt")
const { User } = require("../Models/User")
require("dotenv").config
console.log("asdfasdfasdfasfasdf")
passport.use(
  new jwt(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: process.env.secretKey
    },
    async (payload, done) => {
      console.log("asdf")
      try {
        console.log("hello")
        const user = await User.findOne({ _id: payload.user._id })
        if (!user) return done(null, false)
        done(null, user)
      } catch (err) {
        done(err, false)
      }
    }
  )
)
