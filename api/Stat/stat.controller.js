const   express = require("express"),
        router = express.Router(),
        statService = require("./stat.service");

router.get("/user/mark/average/:id", getMarkAverage);
router.get("/offer/lastMonth/:id", offerLastMonth);
router.get("/actuality", actuality);

module.exports = router;

function getMarkAverage(req, res, next) {
    statService
        .getMarkAverage(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function offerLastMonth(req, res, next) {
    statService
        .offerLastMonth(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function actuality(req, res, next) {
    statService
        .actuality(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}