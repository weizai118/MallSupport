//目的是运行数据库
require('./db');

let config = require('./config');
let express = require('express');

let app = express();

// app.use('/user', userRouter);


// 解析json格式的数据
app.use(express.json());

console.log(config.PORT);


//开启服务器
app.listen(config.PORT);