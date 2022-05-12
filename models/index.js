// MIDDLEMAN FILE FOR ROUTING ALL MODEL MODULES FOR USE
// import Model files
const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

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

// many-to-many associations
// allows User and Post to query each other's info in context of a vote
User.belongsToMany(Post, {
    // through property sets a connection between User and Post through Vote
    through: Vote,
    // name of the Vote model is displayed AS: for queries
    as: 'voted_posts',
    // FK constraint set up in Vote, made to be unique
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    // through property sets a connection between Post and User through Vote
    through: Vote,
    as: 'voted_posts',
    // FK constraint in Vote, made to be unique
    foreignKey: 'post_id'
});

// FK associations
// connects [one] Vote to [single] User
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

// connects [one] Vote to [single] Post
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

// connects [one] User to [their many] Vote(s)
User.hasMany(Vote, {
    foreignKey: 'user_id'
});

// connects [one] Post to [many] Vote(s)
Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

// connects [single] Comment to [single] User
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

// connects [single] Comment to [single] Post
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

// connects [single] User to [many] Comment(s)
User.hasMany(Comment, {
    foreignKey: 'user_id'
});

// connects [single] Post to [many] Comment(s)
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment };