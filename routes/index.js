var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../model/url.js');
var UrlModel = mongoose.model('Url')
/* GET home page. */
router.get('/', function(req, res, next) {
  var url = req.url;
  url='http://'+req.headers.host+'/'+url.slice(1);
  UrlModel.findOne({short_url:url}).exec(function (err,urls) {
      if(err){
         return res.send({error:'MongoDB Error'})
      } else if(urls!=null) {
          res.redirect(urls.original_url);
      } else 
         res.send({error:'No short url found for given input'});
  })
});

module.exports = router;
