var express = require('express');
var router = express.Router();
var Heart = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/update', function (req, res) {
    var newdata = Heart({
        systolic:129,
        diastolic:91,
        rate:134,
        time:'2017-3-1'
    });

    newdata.save(function (err, result) {
        if(err) res.send(err);

        // res.send(result);
        Heart.find({},  function (err,data) {
            if(err) {
                res.send(err);
            }

            res.json(data);

        }).sort({'time':1});
    })
});

router.get('/all',function (req, res) {
    Heart.find({},  function (err,data) {
        if(err) {
            res.send(err);
        }

        res.json(data);


    }).sort({'time':1});
});

router.get('/getCurrent',function (req,res) {
    Heart.find({}, function (err,data) {
        if(err) {
            res.send(err);
        }
        res.json(data[data.length-1]);
    }).sort({'time':1});
});

router.post('/update', function (req, res, next) {
    var newdata = Heart({
        systolic:req.body.systolic,
        diastolic:req.body.diastolic,
        rate:req.body.rate,
        time:req.body.time
    });

    newdata.save(function (err, result) {
        if(err) res.send(err);

        res.send(result);
    })

});


module.exports = router;
