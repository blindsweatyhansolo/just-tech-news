// import Sequelize's Model class and Datatypes object
const { Model, DataTypes } = require('sequelize');
// import sequelize module from connection.js
const sequelize = require('../config/connection');

// create our User model extending from sequelize's Model class
class User extends Model {}

// define table columns and configuration
User.init(
    // pass in two objects as arguments: columns and its datatypes / configuration options for the table
    {
        // TABLE COLUMN DEFINITIONS
        // define id column
        id: {
            // use the special Sequelize DataTypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            // equivalent to SQL's 'NOT NULL' option
            allowNull: false,
            // Primary Key definition
            primaryKey: true,
            // turn on auto-increment
            autoIncrement: true
        },
        // define username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // sets that there CAN NOT be any duplicate email values in table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creatingt table data
            validate: {
                isEmail: true
            }
        },
        // define password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long (min length)
                len: [4]
            }
        }
    },
    {
        // TABLE CONFIGURATION OPTIONS
        // pass in imported sequelize connection (direct connection to our db)
        sequelize,
        // does not auto create createdAt/updatedAt timestamp fields
        timestamps: false,
        // does not pluralize name of db table
        freezeTableName: true,
        // use underscores insted of camel-casing
        underscored: true,
        // model name stays lowercase in the db
        modelName: 'user'
    }
);

module.exports = User;