const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create Post model
class Post extends Model {};

// create fields/columns for Post model
Post.init(
    // first block (parameter) defines schema
    {
        id: {   // column name
            type: DataTypes.INTEGER,    // type (uses Sequelize's DataTypes)
            allowNull: false,           // NULL value not allowed
            primaryKey: true,           // id is set as Primary Key (PK)
            autoIncrement: true         // automatically increments with each new Post object
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {             // native Sequelize validation function
                isURL: true         // checks if string is formatted as a URL
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {           // references property establishes a Foreign Key relationship
                model: 'user',      // which Model it references
                key: 'id'           // which value from that model (user's PK)
            }
        }
    },
    // second block (parameter) configures the metadata, including name conventions
    {
        sequelize,                  // passing the connection instance
        freezeTableName: true,      // will NOT pluralize table name
        underscored: true,          // spaces become underscores instead of camelCasing
        modelName: 'post'           // when tableName is not defined, modelName is used and pluralized
                                        // if freezeTableName is false
    }
);

module.exports = Post;