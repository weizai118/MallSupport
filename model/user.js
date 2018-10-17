/*----------------定义user模块model------------------*/
let mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, '用户名不能为空'],
        unique: [true, '用户名不可重复']
    },
    password: {
        type: String,
        required: [true, '密码不能为空'],
    },
    age: {
        type: Number,
        min: [0, '年龄不能小于0'],
        max: [120, '年龄不能大于120']
    },
    role: {
        type: Number,
        default: 0 //0:普通商家,10:管理员
    },
    createTime: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('users', userSchema);