require('../db');

let productService = require('../service/product');

async function testProduct() {
    let product = {
        name: "iphone16",
        price: '89999',
        //存货量
        stock: 200,
        category: ""
        // category:{
        //     //TODO:商品分类需要和categories表联系起来----------------------
        //     type:mongoose.Schema.Types.ObjectId,
        //     required:[true,'分类id不能为空']
        // },
    }
}