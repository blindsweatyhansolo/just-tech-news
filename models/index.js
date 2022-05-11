// MIDDLEMAN FILE FOR ROUTING ALL MODEL MODULES FOR USE
// import Model files
const User = require('./User');
const Post = require('./Post');

// create associations
// a single User can have MANY Posts
User.hasMany(Post, {
    // links id column in User model to
    // FK in Post model which is 'user_id'
    foreignKey: 'user_id'
});

// reverse association
// defines the relationship of the Post model to the User
// imposed constraint is that a post can belong to one user, but not many
Post.belongsTo(User, {
    // declare link to the FK in Post model
    foreignKey: 'user_id',
});


module.exports = { User, Post };