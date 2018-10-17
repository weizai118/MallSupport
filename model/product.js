let mongoose = require('mongoose');
let productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '商品名不能为空'],
        unique: [true, '商品名不可重复']
    },
    price: {
        type: String,
        required: [true, '商品价格不能为空'],
    },
    //存活量
    stock: {
        type: Number,
        default: 0
    },
    category: {
        //TODO:商品分类需要和categories表联系起来----------------------
        type: mongoose.Schema.Types.ObjectId,
        required: [true, '分类id不能为空']
    },
    description: {
        type: String
    },
    isOnSale: {
        type: Boolean,
        default: true
    },
    createTime: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('products', productSchema);