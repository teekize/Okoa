var express = require('express');
var router = express.Router();

const Refugee = require("../models").Refugee;
const School = require("../models").School;
const Supplies = require("../models").Supplies;

const admin = {

  "email": "admin-recep@okoa.com",
  "password": "admin-123"

};

const authorize = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.redirect("/");
  }
};

// route to handle the admin-login
router.post("/admin/login", function (req, res, next) {


  if (req.body.password === admin.password && req.body.email === admin.email) {

    res.cookie("token", admin.password);
    res.redirect('/homepage')//make a home page for the admin-at OKoa
  } else {
    res.redirect('/');
  }


})

// route to handle admin-logout
router.post('/logout', function (req, res, next) {
  if (!req.cookies.token) {
    res.redirect("/")
  } else {
    res.clearCookie("token");
    res.redirect('/');


  }
})

/* GET home page. */
router.get('/', function (req, res, next) {

  console.log(req.cookies.token)

  if (req.cookies.token) {
    res.redirect("/homepage");
  } else {
    res.render("index");
  }

});


// this route is to display the main landing page of the admin after they have logged in
router.get("/homepage", function (req, res, next) {
  authorize(req, res);
  const name = req.cookies.token;

  if (name) {
    res.render("homepage", { name: admin.email })
  } else {
    res.redirect(304, "/");
  }

})

/*
===================== HOMEPAGES LINKS==============
*/
// route for main refugee page
router.get("/refugee-homepage", function (req, res, next) {
  authorize(req, res);
  res.redirect("/refugee");
  // res.json({ message: "helloe this is the reugee main" })
})

// route for main refugee page
router.get("/tents-homepage", function (req, res, next) {
  authorize(req, res);
  res.redirect("/tentz")
})



// route for main refugee page
router.get("/stats-homepage", function (req, res, next) {
  authorize(req, res);
  res.render("stats-homepage")
})


/*
=================== END OF HOMEPAGES LINKS====================
*/

// route to admit a refugee to school
router.post("/school", async function (req, res, next) {


  authorize(req, res);
  try {


    const formData = req.body;
    console.log(formData);
    const results = await School.create(formData);
    res.redirect(`/refugee/${formData["refugeeid"].trim()}`)
    // res.status(200).send("nimeadd kwa database");
  } catch (error) {
    console.log(error)
  }


});

const countries = {
  KENYA: "🇰🇪",
  UGANDA: "🇺🇬",
  TANZANIA: "🇹🇿",
  SOUTHSUDAN: "🇸🇸",
  SOMALIA: "🇸🇴"
}


const moment = require("moment");
function reportedOn(createdAt) {
  const date = moment(createdAt).format("MMMM D, Y, h:mma");
  return date
}


const nation = require("./utils").countries


router.get("/stats/:nation", async function (req, res, next) {

  let country = req.params["nation"].trim().toUpperCase();
  console.log(nation[country]);

  if (country in nation) {
    const amount = await Refugee.count({
      where: {
        Nationality: nation[country]
      }
    });
    console.log(country)
    res.json(amount);
  } else {
    console.log("naiko");
    res.json({ message: "nation not found" })
  }
})



// route to get school
router.get("/school/:refugeeid", async function (req, res, next) {
  authorize(req, res);

  try {
    const results = await School.findAll({ where: { refugeeid: req.params["refugeeid"] } });
    console.log(JSON.stringify(results));
    // res.status(200).send('nimeregister vitu');
    if (results.length === 0) {
      res.json({ message: "no data" })
    } else {
      res.json({ results: results });
    }

  } catch (err) {
    next(err)
  }

});




module.exports = router;
