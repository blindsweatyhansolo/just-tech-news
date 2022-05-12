const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create Post model
class Post extends Model {
    // MODEL METHOD
    // static indicates the upvote method is based on the Post model
    // (not an INSTANCE like in User model)
    // Post.upvote() now can be used like any other built-in method
    // body = req.body / models = an object of the models
    static upvote(body, models) {
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        })
          .then(() => {
              return Post.findOne({
                  where: {
                      id: body.post_id
                  },
                  attributes: [
                      'id',
                      'post_url',
                      'title',
                      'created_at',
                      [
                          sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post_id = vote.post_id)'),
                          'vote_count'
                      ]
                  ]
              });
          });
    }
};

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