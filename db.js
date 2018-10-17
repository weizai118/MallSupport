let mongoose = require('mongoose');
let config = require('./config');

mongoose.connect('mongodb://localhost/' + config.DB, {useNewUrlParser: true});
let db = mongoose.connection;

db.on('error', (err) => {
    console.log('数据库连接失败');
});

db.once('open', () => {
    console.log('数据库连接成功');
});