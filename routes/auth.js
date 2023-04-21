const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const becrypt = require('bcryptjs');
const bcrypt = require('bcryptjs/dist/bcrypt');
var jwt = require('jsonwebtoken');
const fatchUser = require('../middlewares/fatchuser');


require('dotenv').config({ path: '.env' });
const JWT_SECRET = process.env.JWT_SECRET;

// ROUTE :1   create user using post: no login require (/createUser)


router.post('/createUser', [body('name', 'Name must be 3 letters').isLength({ min: 3 }), body('email', 'Enter valid email').isEmail(), body('password', 'password must be atleast 5 letters').isLength({ min: 5 })
], async (req, res) => {


  // if there are error return bad request


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      created: false,
      error: errors.array()
    });
  }

  // check whether the user with this email exits already

  try {


    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({
        created: false,
        error: "A user already exists with this email"
      })

    }
    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      password: securedPassword,
      email: req.body.email
    }).then((user) => {

      const data = {
        user: {
          id: user.id
        }
      };
      const jwtToken = jwt.sign(data, JWT_SECRET);


      res.json({
        created: true,
        token: jwtToken
      });
      console.log('user added successfully');
    }
    );
  }

  catch (error) {
    res.status(500).json({
      created: false,
      error: error.message
    });
  }


}
);


//  ROUTE:2 login page using post: no login require (/createUser)

router.post('/login', [body('email', 'Enter valid email').isEmail(), body('password', `password can't be blank`).exists()
], async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        login: false,
        error: "user does not exist"
      });
    }
    else {
      bcrypt.compare(password, user.password, function (err, res2) {
        if (res2) {
          const data = {
            user: {
              id: user.id
            }

          };
          const jwtToken = jwt.sign(data, JWT_SECRET);
          res.json({
            login: true,
            name: user.name,
            token: jwtToken
          });
        }
        else {
          res.status(400).json({ "login": false });
        }
      });
    }

  }
  catch (error) {
    res.json({
      error: error.message
    })
  }

});



// ROUTE:3 Get user using post:loggedIn required;


router.post('/getUser', fatchUser, async (req, res) => {
  try {

    let userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    res.send(user);

  } catch (error) {
    res.json({
      error: error.message
    });
  }
});


module.exports = router