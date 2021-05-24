var express = require('express');
var router = express.Router();

const Refugee = require("../models").Refugee;
const School = require("../models").School;
const Supplies = require("../models").Supplies;

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
router.post('/admit/refugee', async function (req, res, next) {


  authorize(req, res);
  try {

    const formData = req.body;
    console.log(formData);
    const results = await Refugee.create(formData)
    let id = results.dataValues.id
    res.redirect(`/refugee/${id}`)
  } catch (error) {
    console.log(error);

    res.redirect("/homepage");
  }

  // res.status(200).send("nime admit the refugee");
});

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
// route to view a refugee
router.get("/refugee/:id", async function (req, res, next) {
  authorize(req, res);

  try {
    console.log(typeof req.params["id"])
    const results = await Refugee.findByPk(req.params["id"]);

    if (!results) {

      console.log(results);
      next(` THE REFUGEE WITH ID NUMBER: ${req.params["id"]} IS Not IN THE SYSTEM`)
    } else {

      // const school = await School.findAll({ where: { refugeeid: req.params["id"] } });
      // const supplies = await Supplies.findAll({ where: { refugeeid: req.params["id"] } });

      let result = results.dataValues
      let nation = result["Nationality"];
      let createdAt = result["createdAt"];
      result["Nationality"] = countries[nation];
      result["pronoun"] = result.Sex === "male" ? "he" : "she";
      result["createdAt"] = reportedOn(createdAt);


      console.log(result)
      // console.log(JSON.stringify(supplies));
      // console.log(JSON.stringify(school));
      res.render("refugee", result);
    }

  } catch (err) {
    console.log(err)
  }


});

// route to view all refugees
router.get("/refugee", async function (req, res, next) {
  authorize(req, res);

  let pages = 0;


  try {


    const results = pages === 0 ? await Refugee.findAll({
      attributes: ["id", "FirstName", "LastName", "Nationality"],
      limit: 10
    }) : await Refugee.findAll({
      attributes: ["id", "FirstName", "LastName", "Nationality"],
      offset: 10,
      limit: 10
    });
    pages += 1


    // results.forEach(Refugee=>)
    resData = (results)
    console.log(resData)
    res.render('viewref', { results: resData });


  } catch (err) {

    console.log(err)
  }

});


// route for pagination prev
router.get("/refugee-prev", function (req, res, next) {
  res.redirect("/refugee")
})
// route for pagination next
router.get("/refugee-next", async function (req, res, next) {
  authorize(req, res);

  try {
    const results = await Refugee.findAll({
      attributes: ["id", "FirstName", "LastName", "Nationality"],
      offset: 10,
      limit: 10
    });

    resData = (results)
    console.log(resData)
    res.render('viewref', { results: resData });


  } catch (err) {

    console.log(err)
  }

});

// route to handle user search
router.get("/refugee-search", function (req, res, next) {

  authorize(req, res);

  try {

    const id_given = `${req.query["id-refugee"]}`;
    // typeof id_given !== Number ? next({ msg: "we dont have that in the system", status: 404 }) :

    // if (typeof id_given !== Number) {
    //   throw Error("dont have that in the system");
    // }else{

    // }
    console.log(typeof id_given)
    console.log(id_given)
    // const results= await Refugee.findByPk(parseInt(req.body["id-refugee"]));
    res.redirect(`/refugee/${id_given}`);
  } catch (err) {
    console.log(err);
    next(err)
  }

})


const nation = {
  KENYA: "🇰🇪",
  UGANDA: "🇺🇬",
  TANZANIA: "🇹🇿",
  SOUTHSUDAN: "🇸🇸",
  SOMALIA: "🇸🇴"
}


router.get("/stats/:nation", async function (req, res, next) {

  let country = req.params["nation"].trim().toUpperCase();
  console.log(nation[country]);

  if (country in nation) {

    const amount = await Refugee.count({
      where: {
        Nationality: nation[country]

      }
    });

    console.log(amount)
    res.json(amount);

  } else {
    console.log("naiko");
    res.json({ message: "nation not found" })
  }



})

// route to assign supplies
router.post("/supplies", async function (req, res, next) {
  authorize(req, res);

  const formData = req.body;

  const results = await Supplies.create(formData);
  res.redirect(`/refugee/${formData["refugeeid"].trim()}`)
  console.log(results);
  // res.status(200).send('nimeregister vitu');
});

// route to get supplies
router.get("/supplies/:refugeeid", async function (req, res, next) {
  authorize(req, res);

  try {
    const results = await Supplies.findAll({ where: { refugeeid: req.params["refugeeid"] } });
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
