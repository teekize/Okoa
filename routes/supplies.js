
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
==================== SUPPLIES =======================
*/

// route for main refugee page
router.get("/supplies-homepage", function (req, res, next) {
    authorize(req, res);
    res.redirect("/supplies-addition");
})

// route to add a new entry to supplies stock -haiassign supplies.
router.post("/supplies-addition", async (req, res, next) => {
    authorize(req, res);

    // get the form data
    const formData = req.body;
    const results = await Assign.create(formData)
    console.log(formData);
    res.redirect("/supplies-addition");

});

// this route will edit a supply details
router.post("/supplies-edit/", async (req, res, next) => {
    authorize(req, res);

    const suppliesId = req.body.id;
    const newChanges = {

        Item: req.body.Item,
        Quantity: req.body.Quantity
    }

    try {
        const results = await Assign.findByPk(suppliesId);
        if (!results) {

            console.log(results);
            next(` THE supply WITH ID NUMBER: ${req.params["id"]} IS Not IN THE SYSTEM`)
        } else {

            await Assign.update(newChanges, {
                where: {
                    id: suppliesId
                }
            });

            res.redirect(`/supplies-addition`)

        }

    } catch (err) {
        console.log(err)
    }
})


// this route will delete a supply
router.get("/supplies-delete/:id", async (req, res, next) => {
    authorize(req, res);

    const suppliesId = req.params.id.trim();
    const result = await Assign.destroy({
        where: {
            id: suppliesId
        }
    });
    // this result will be the numbe of destroyed rows
    res.redirect("/supplies-addition");
})

// route to display all supplies.
router.get("/supplies-addition", async (req, res, next) => {

    authorize(req, res);
    try {
        const results = await Assign.findAll({
            attributes: ["id", "Item", "Quantity"],
            limit: 10
        })

        // results.forEach(Refugee=>)
        resData = (results)
        console.log(resData)
        res.render("supplies-homepage", { results: resData });
    } catch (e) {
        console.log(e)
    }
});



/****=================================================================================== */


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

/*
==================== END SUPPLIES=======================
*/

module.exports = router;


{/* <form action="/supplies-edit/<%=supplies.id%>" method="POST">


<div class="form-row">
    <div class=" form-group col-md-6">
        <label for="exampleInputEmail1">ITEM</label>

        <input type="text" name="Item" value="<%=supplies.Item%>">

    </div>

    <div class=" form-group col-md-6">
        <label for="exampleInputEmail1">Quantity</label>

        <input type="text" name="Item" value="<%=supplies.Quantity%>">

    </div>


</div>


<button type="submit" class="btn btn-primary">Save Changes</button>
</form> */}

{/* <div class="modal" tabindex="-1" id="EDIT">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Edit SUPPLIES</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <!-- for school admission -->
                <form action="/supplies-edit/<%=supplies.id%>" method="POST">


                    <div class="form-row">
                        <div class=" form-group col-md-6">
                            <label for="exampleInputEmail1">ITEM</label>

                            <input type="text" name="Item" value="<%=supplies.Item%>">

                        </div>

                        <div class=" form-group col-md-6">
                            <label for="exampleInputEmail1">Quantity</label>

                            <input type="text" name="Item" value="<%=supplies.Quantity%>">

                        </div>


                    </div>


                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </form>

                <!-- end of login form for admin -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
            </div>
        </div>
    </div>
</div> */}
