var express = require('express');
var router = express.Router();
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

/*
===================== TENTS =========================
*/


router.post("/tents", async (req, res, next) => {
    authorize(req, res);

    const formData = req.body;
    const result = await Tents.create(formData);
    console.log(result);
    res.redirect("/tentz");

})



router.get("/tentz", async (req, res, next) => {
    authorize(req, res);


    try {
        const results = await Tents.findAll({
            attributes: ["id", "occupant"],
            limit: 10
        })

        // results.forEach(Refugee=>)
        resData = (results)
        console.log(resData)
        res.render("tents-homepage", { results: resData });
    } catch (e) {
        console.log(e)
    }

    /*
    
    <td> <a href="/refugee/<%=refugee.id%>" class="btn-info">View <%=refugee.FirstName%></a></td>
    */


})


// this route will edit a tents details
router.post("/tents-edit/", async (req, res, next) => {
    authorize(req, res);

    const tentId = req.body.id;
    const newChanges = {

        occupant: req.body.occupant,
    }

    try {
        const results = await Tents.findByPk(suppliesId);
        if (!results) {

            console.log(results);
            next(` THE Tent WITH ID NUMBER: ${tentId} IS Not IN THE SYSTEM`)
        } else {

            await Tents.update(newChanges, {
                where: {
                    id: tentId
                }
            });

            res.redirect(`/tenz`)

        }

    } catch (err) {
        console.log(err)
    }
})

// this route will delete a tent
router.get("/tent-delete/:id", async (req, res, next) => {
    authorize(req, res);

    const tentId = req.params.id.trim();
    const result = await Tents.destroy({
        where: {
            id: tentId
        }
    });
    // this result will be the numbe of destroyed rows
    res.redirect("/tentz");
})


/*
===================== END TENTS =========================
*/

module.exports = router;