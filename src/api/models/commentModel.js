const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    names : {type: String, required: true},
    content: {type: String, required: true},
    date: {type: Date, default: Date.now},
    post: {type : String}   
});

module.exports = mongoose.model('Comment', CommentSchema);