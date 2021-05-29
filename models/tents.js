const Sequelize = require("sequelize");
const moment = require("moment");

module.exports = (sequelize) => {
    class Tent extends Sequelize.Model {
        reportedOn() {
            const date = moment(this.createdAt).format("MMMM D, Y, h:mma");
            return date
        }
    };

    Tent.init({

        occupant: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }

    }, { sequelize });

    return Tent;
}