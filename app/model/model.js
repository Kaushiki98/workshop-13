const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const mongoSchema = mongoose.Schema;

const userSchema = new mongoSchema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, lowercase: true, unique: true, require: true },
  password: { type: String, required: true }
}, { timestamps: true, versionKey: false });

const dbuserschema = mongoose.Schema(userSchema);
const UserModel = mongoose.model('user', dbuserschema);

function hash(password) {
  var salt = bcrypt.genSaltSync(10);
  var hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
}

class user {

  createUser = (req, res) => {

    const newUser = new UserModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash(req.body.password),
    });
    UserModel.findOne({ email: req.body.email }, (err, data) => {
      if (data) {
        return res.status(500).send({
          message: "Email already exists"
        })
      }
      else {
        newUser.save((err, data) => {
          if(data) {
            return res.status(200).send ({ message: "User successfully registered" })
          }else {
            return res.status(500).send({ message: "Enter valid Details" })
          }
        })
      }
    })
  }

  loginUser = (userLogin, callback) => {
    UserModel.findOne({ email: userLogin.email }, callback)
  };
}

module.exports = new user()