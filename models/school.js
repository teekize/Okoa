const Sequelize = require("sequelize");
const moment = require("moment");

module.exports = (sequelize) => {
    class School extends Sequelize.Model {
        reportedOn() {
            const date = moment(this.createdAt).format("MMMM D, Y, h:mma");
            return date
        }
    };

    School.init({

        FirstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Finders Name cannot be empty string"
                },
                len: [5, 100]

            }
        },

        MiddleName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Finders Name cannot be empty string"
                },
                len: [5, 100]

            }
        },

        LastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Finders Name cannot be empty string"
                },
                len: [5, 100]

            }
        },

        SchoolType: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        StartDate: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [1, 50],
                notEmpty: true
            }
        },
        refugeeid: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }

    }, { sequelize });

    return School;
}