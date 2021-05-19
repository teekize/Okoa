var express = require('express');
var router = express.Router();

const admin = {

  "email": "admin-recep@okoa.com",
  "password": "admin-123"

}

/* GET home page. */
router.get('/', function (req, res, next) {

  console.log(req.cookies.token)

  if (req.cookies.token) {
    res.redirect("/homepage");
  } else {
    res.render("index");
  }

});


router.get("/homepage", function (req, res, next) {
  authorize(req, res);
  const name = req.cookies.token;

  if (name) {
    res.render("homepage", { name: admin.email })
  } else {
    res.redirect(304, "/");
  }

})




const authorize = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.redirect("/");
  }
}
// route to display the register form
router.get("/admit/refugee", function (req, res, next) {
  authorize(req, res);
  res.render("reg");
})

// route to admit a new refugee
router.post('/admit/refugee', function (req, res, next) {
  authorize(req, res);
  res.status(200).send("nime admit the refugee");
});

// route to admit a refugee to school
router.post("/admit/refugee/school", function (req, res, next) {
  authorize(req, res);
  res.status(200).send("nimeadd kwa database");
});

// route to view a refugee
router.get("/refugee/:id", function (req, res, next) {
  authorize(req, res);
  res.render('refugee');
});

// route to view all refugees
router.get("/refugee/all", function (req, res, next) {
  authorize(req, res);
  res.render('viewsref');
});

// route to assign supplies
router.post("/supplies", function (req, res, next) {
  authorize(req, res);
  res.status(200).send('nimeregister vitu')
});

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
module.exports = router;
