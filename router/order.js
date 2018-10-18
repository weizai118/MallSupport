let orderService = require('../service/order');
let router = require('express').Router();

//添加订单
router.post('/', async (req, res) => {
    let results = await orderService.add(req.body);
    res.doSucess(results);
});

router.get('/', async (req, res) => {
    let page = req.query.page;
    let results = await orderService.getOrderByPage(page);
    res.doSucess(results);
});


module.exports = router;