//目的是运行数据库
require('./db');

let config = require('./config');
let express = require('express');

let app = express();

// app.use('/user', userRouter);


console.log(config.PORT);


//开启服务器
app.listen(config.PORT);