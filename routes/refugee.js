var express = require('express');
var router = express.Router();
const util = require("./utils");

const moment = require("moment");

const Refugee = require("../models").Refugee;
const School = require("../models").School;
const Supplies = require("../models").Supplies;
const Assign = require("../models").Assign;
const Tents = require("../models").Tent;


const admin = {

  "email": "admin-recep@okoa.com",
  "password": "admin-123"

}

const authorize = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.redirect("/");
  }
}

function reportedOn(createdAt) {
  const date = moment(createdAt).format("MMMM D, Y, h:mma");
  return date
}


// this route will delete a refugee
router.get("/refugee-delete/:id", async (req, res, next) => {
  authorize(req, res);

  const refugeeId = req.params.id.trim();
  const result = await Refugee.destroy({
    where: {
      id: refugeeId
    }
  });
  // this result will be the numbe of destroyed rows
  res.redirect("/refugee");
})

// this route will edit a refugee details
router.post("/refugee-edit/", async (req, res, next) => {
  authorize(req, res);

  const refugeeId = req.body.id
  const changedData = {
    FirstName: req.body.FirstName,
    MiddleName: req.body.MiddleName,
    LastName: req.body.LastName,
    Sex: req.body.Sex,
    Age: req.body.Age,
    MaritalStatus: req.body.MaritalStatus,
    disable: req.body.disable,
    reasonfordisplacement: req.body.reasonfordisplacement,
    Nationality: req.body.Nationality,
    Tent: req.body.Tent
  }
  // const changedData = req.body


  try {
    const results = await Refugee.findByPk(refugeeId);
    if (!results) {

      console.log(results);
      next(` THE REFUGEE WITH ID NUMBER: ${req.params["id"]} IS Not IN THE SYSTEM`)
    } else {


      console.log(changedData)
      await Refugee.update(changedData, {
        where: {
          id: refugeeId
        }
      });

      res.redirect(`/refugee/${refugeeId}`)

    }

  } catch (err) {
    console.log(err)
  }
})




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
    // res.json(formData);
  } catch (error) {
    console.log(error);

    res.redirect("/homepage");
  }

  // res.status(200).send("nime admit the refugee");
});


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
      result["Nationality"] = util.countries[nation];
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


module.exports = router;
