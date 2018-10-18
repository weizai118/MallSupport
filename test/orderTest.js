let orderService = require('../service/order');
require('../db');

async function testOrder() {

    let order = {
        productId: "5bc840e56c37ee2c846603ec",
        productName: "荣耀9青春版",
        productPrice: '200',
        count: 10
    };
    //
    // let result =await orderService.add(order);
    // console.log(result);
    let results = await orderService.getOrderByPage(2);
    console.log(results);

}

testOrder();