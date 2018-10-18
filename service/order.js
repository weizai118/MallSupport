let Order = require('../model/order');
let productService = require('../service/product');
let config = require('../config');
//引入第三方库big.js,用于钱的精确处理
let Big = require('big.js');
//x.div(y):除;plus(z):加;times(9):乘;minus('1.234567801234567e+8'):减;
//生成订单
async function add(order) {
    //订单:包含商品id,商品名称,商品单价,商品数量,价格小计(商品单价*商品数量)
    //1.根据商品id查找商品是否存在
    //获取订单id的产品
    let product = await productService.getProductById(order.productId);
    //判断商品是否存在
    if (!product) {
        throw Error(`id为${order.productId}的商品不存在`)
    }

    //给商品名和价格重新赋值
    order.productName = product.name;
    order.productPrice = product.price;

    //2.如果商品存在,判断订单中商品的数量和该商品的库存数量
    if (order.count > product.stock) {
        throw Error(`当前存货量不足,最多只能购买${product.stock}个`)
    }
    //3.库存如果足够的话,计算价格(注意:这里的单价需要使用product.price)
    let price = product.price;
    let total = Big(price).times(order.count);
    //price是String类型 涉及到钱的需要使用Decimal128
    order.total = total;
    //4.生成订单
    let getOrder = await Order.create(order);
    //5.扣减库存数量!!!!!!!!!!!!!!!!!
    await productService.updateProductById(order.productId, {stock: product.stock - order.count});
    return getOrder;

}

//分页查询
async function getOrderByPage(page = 1) {
    let offset = (page - 1) * config.PAGE_SIZE;
    let results = await Order.find().skip(offset).limit(config.PAGE_SIZE);
    return results;
}


//将方法暴露出去
module.exports = {
    add,
    getOrderByPage
};