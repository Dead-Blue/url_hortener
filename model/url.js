var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var urlSchema = new Schema({
    original_url:String,
    short_url:String
});
mongoose.model('Url',urlSchema);