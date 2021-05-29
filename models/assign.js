const Sequelize = require("sequelize");
const moment = require("moment");

module.exports = (sequelize) => {
    class Assign extends Sequelize.Model {
        reportedOn() {
            const date = moment(this.createdAt).format("MMMM D, Y, h:mma");
            return date
        }
    };

    Assign.init({


        Item: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        Quantity: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [1, 50],
                notEmpty: true
            }
        }

    }, { sequelize });

    return Assign;
}