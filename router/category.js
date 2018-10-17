let categoryService = require('../service/category');
let categoryRouter = require('express').Router();

/**
 * 分页查询商品种类
 * @param page
 * @url http://8000/category get
 * TODO 还未完全完成
 */
categoryRouter.get("/:page", async (req, res) => {
    let result = await categoryService.getCategoryByPage(page)
    res.doSucess(result)
});

/**
 * 添加商品种类
 * @param category,JSON格式{name:"手机电脑"},参数在请求体中传递(request的body中)
 * @url http://8000/category post
 * 测试OK
 */
categoryRouter.post("/", async (req, res) => {
    let result = await categoryService.addCategory(req.body);
    res.doSucess(result)
});

/**
 * 更新商品种类
 * @param name,参数在请求路径中传递
 * @url http://8000/category/id put
 * 测试
 */
categoryRouter.put("/:id", async (req, res) => {
    let id = req.params.id;
    await categoryService.updateCategoryById(id, req.body);
    res.doSucess();
});

/**
 * 删除商品种类
 * @param name,参数在请求路径中传递
 * @url http://8000/category/id delete
 */
categoryRouter.delete("/:id", async (req, res) => {
    let id = req.params.id;
    await categoryService.deleteCategoryById(id);
    res.doSucess()
});

module.exports = categoryRouter;
