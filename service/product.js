let Product = require('../model/product');

//添加商品
async function addProduct(product) {
    let result = await Product.findOne({_id: product.id});
    if (result) {
        throw Error(`id为${product.id}的商品已经存在`)
    }
    result = await Product.create(product);
    return result;
}

//更新商品id
async function updateProductById(id, product) {
    await isExistById(id);
    result = await Product.updateOne({_id: id}, product);
    if (result.n !== 1) {
        throw Error(`id为${id}的商品修改失败`)
    }

}

//抽取方法检查对应id值的商品是否存在
async function isExistById(id) {
    let result = await Product.findOne({_id: id});
    if (!result) {
        throw Error(`id为${id}的商品不存在`)
    }
}

//获得商品(商品)id
async function getProductById(id) {
    let result = await Product.findOne(id);
    if (!result) {
        throw Error(`id为${id}的商品不存在`);
    }
    return result;
}

//删除商品id
async function deleteById(id) {
    await isExistById(id);
    let result = await Product.deleteOne({_id: id})
    if (result !== 1) {
        throw Error(`id为${id}的商品删除失败`)
    }
}

//分页获取商品
async function getProductByPage(page) {
    let result = await Product.find().skip(pge).limit(2);
    return result;
}


module.exports = {
    addProduct,
    updateProductById,
    getProductById,
    deleteById,
    getProductByPage
};