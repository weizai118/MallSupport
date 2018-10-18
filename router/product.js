let productService = require('../service/product');
let router = require('express').Router();


//添加商品
router.post('/', async (req, res) => {
    let result = await productService.addProduct(req.body);
    res.doSucess(result);
});

//更新商品
router.put('/:id', async (req, res) => {
    let id = req.params.id;
    await productService.updateProductById(id, req.body);
    res.doSucess();
});

//获取商品byid
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let result = await productService.getProductById(id);
    res.doSucess(result);
});

//删除商品
router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    await productService.deleteById(id);
    res.doSucess();
});

//分页查询  http://localhost:8000/product?page=1
router.get('/', async (req, res) => {
    let page = req.query.page;
    let results = await productService.getProductByPage(page);
    res.doSucess(results);
});

module.exports = router;