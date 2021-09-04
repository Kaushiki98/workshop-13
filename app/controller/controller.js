const Joi = require('joi')

const userModel =  require('../model/model')
const bcrypt = require('bcrypt');

const RegisterValidation = Joi.object({
  firstName: Joi.string().required().pattern(new RegExp('^[A-Z][a-z]{3,}$')),
  lastName: Joi.string().required().pattern(new RegExp('^[A-Z][a-z]{3,}$')),
  email: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')),
  password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*?[0-9]).{5,}$')),
});

const createToken = (result) => {
  return JWT.sign({ result }, process.env.ACCESS_JWT_ACTIVATE, { expiresIn: '1h' });
}

const LoginValidation = Joi.object().keys({
  email: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')),
  password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*?[0-9]).{5,}$'))
})

class userController {

  createUser = (req, res) => {
    const userRegisteration = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    };
    const validation = RegisterValidation.validate(userRegisteration);

    if (validation.error) {
      return res.status(400).send({ 
        status: 400,
        message: "Please Enter Valid Details" 
      });
    }
    else {
      userModel.createUser(req, res, (err, result) => {
        if (err) {
          console.log("Some error occured while registering user");
          return res.status(500).send({
            status: 500,
            message: "error"
          })
        }
        else {
          return res.status(200).send({
            status: 200,
            success: true,
            message: "User registered sucessfully"
          });
        }
      });
    }
  }

  loginUser = (req, res) => {
    const userLogin = {
      email: req.body.email,
      password: req.body.password
    };
    const validation = LoginValidation.validate(userLogin);

    if (validation.error) {
      return res.status(400).send({ 
        status: 400,
        message: "Please Enter Valid Details" });
    } else {
      userModel.loginUser(userLogin, (err, result) => {
        if (result) {
          bcrypt.compare(userLogin.password, result.password, (err, token) => {
            if (token) {
              createToken(token);
              console.log("login success!")
              res.status(200).send({status: 200, token: createToken(token), message: "Token created successfully" })
            }
            else {
              res.status(500).send({status: 500, message: "Invalid Details" })
            }
          })
        } else {
          res.status(400).send({status: 400, message: "Enter valid Details" })
        }
      })    }
  }

}


module.exports = new userController()