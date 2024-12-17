const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');

const register = async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({"message": "All fields required"});
    }
    
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    await user.save();
    const token = user.generateJwt();
    res
      .status(200)
      .json({token});
  } catch (err) {
    res
      .status(400)
      .json(err);
  }
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({"message": "All fields required"});
  }

  // Convert passport.authenticate to Promise
  const authenticateAsync = () => {
    return new Promise((resolve, reject) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          return reject(err);
        }
        resolve({ user, info });
      })(req, res);
    });
  };

  try {
    const { user, info } = await authenticateAsync();
    
    if (user) {
      const token = user.generateJwt();
      res
        .status(200)
        .json({token});
    } else {
      res
        .status(401)
        .json(info);
    }
  } catch (err) {
    res
      .status(404)
      .json(err);
  }
};

module.exports = {
  register,
  login
};