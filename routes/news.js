var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../model/url.js');
var UrlModel = mongoose.model('Url')
/* GET users listing. */
// router.param('url',function (req,res,next,value) {
//    var exp ="^((https|http|ftp|rtsp|mms)?://)+(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
//    if(value.match(exp)){
//        next();
//        req.url = value;
//    } else {
//        res.send({error:'Invalid Url'});
//    }
// })
router.get('/', function(req, res, next) {
   res.send({error:'No short url found for given input'});
});
router.get('*', function(req, res, next) {
   var exp ="^((https|http|ftp|rtsp|mms)?://)+(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
   var url = req.url;
   url=url.slice(1);
   if(url.match(exp)){
      UrlModel.findOne({original_url:url}).exec(function (err,urls) {
          if(err)
            return res.send({error:'MongoDB Error'})
          else if(urls!=null){
            return  res.send({original_url:urls.original_url,short_url:urls.short_url});
          }  else{
       UrlModel.count({},function (err,counts) {
       var urlCounts =  counts+1; 
       var baseUrl = req.headers.host;
       var shortUrl = 'http://'+baseUrl+'/'+urlCounts;
       var newUrl = new UrlModel({
           original_url:url,
           short_url:shortUrl
       }); 
       newUrl.save(function (err) {
           if(err)
          return res.send({error:'shortUrlsaveError'});
           else
          return res.send({original_url:url,short_url:shortUrl});
       });
   });
          }
      });    
   } else {
     return  res.send({error:'Invalid Url'});
   } 
});

module.exports = router;
