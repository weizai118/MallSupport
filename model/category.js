let mongoose = require('mongoose');
let categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '商品名称不能为空'],
        unique: [true, '商品名称不能重复']
    },
    createTime: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('category', categorySchema);
