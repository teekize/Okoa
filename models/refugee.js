const Sequelize = require("sequelize");
const moment = require("moment");

module.exports = (sequelize) => {
    class Refugee extends Sequelize.Model {
        reportedOn() {
            const date = moment(this.createdAt).format("MMMM D, Y, h:mma");
            return date
        }
    };

    Refugee.init({

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

        Sex: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        Age: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [1, 50],
                notEmpty: true
            }
        },

        MaritalStatus: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [1, 50],
                notEmpty: true
            }
        },
        Nationality: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        Tent: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }

    }, { sequelize });

    return Refugee;
}