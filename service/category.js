let Category = require('../model/category');
let config = require('../config');
/**
 * 获取每页的商品种类数据
 * @param page
 * @returns {Promise<void>}
 * TODO
 */
async function getCategoryByPage(page = 1) {
    //(page-1)*size
    //skip 偏移量=每次跳过多少条数据  offset = (page-1)*size
    let offset = (page - 1) * config.PAGE_SIZE;
    //limit 每页显示多少条数据
    let result = await Category.find().skip(offset).limit(config.PAGE_SIZE);
    return result;
}

/**
 * 添加商品种类 JSON格式{name:"手机电脑"}
 * @param category
 * @returns {Promise<*>}
 */
async function addCategory(category) {
    let result = await Category.findOne({_id: category.id});
    if (result) {
        throw Error(`id为${category.id}的商品种类已经存在`);
    }
    result = await Category.create(category);
    return result;
}

//检查该种类的商品名称是否存在,如果不存在就抛出错误
async function isExistById(id) {
    let result = await Category.findOne({_id: id});
    if (!result) {
        throw Error(`id为${_id}的商品种类不存在`);
    }
}

/**
 * 删除商品种类
 * @param id
 * @returns {Promise<void>}
 */
async function deleteCategoryById(id) {
    await isExistById(id);
    let result = await Category.deleteOne({_id: id});
    if (result.n !== 1) {
        throw Error(`删除id为${_id}的商品种类失败`)
    }
}

/**
 * 更新商品种类
 * @param id
 * @param category JSON格式{name:"手机电脑"}
 * @returns {Promise<void>}
 */
async function updateCategoryById(id, category) {
    await isExistById(id);
    let result = await Category.updateOne({_id: id}, category);
    if (result.n !== 1) {
        throw Error(`更新id为${_id}的商品种类失败`)
    }
}

module.exports = {
    addCategory,
    updateCategoryById,
    deleteCategoryById,
    getCategoryByPage
};