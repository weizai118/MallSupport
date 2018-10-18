//程序的主入口,类似springboot的入口类--->注意:引用位置要放在第一行
//补获express的异步异常
require('express-async-errors');
//目的是运行数据库
require('./db');
//自定义配置
let config = require('./config');
let express = require('express');
//日志处理模块
let morgan = require('morgan');
let userRouter = require('./router/user');
let categoryRouter = require('./router/category');

//自定义中间件
let mdres = require('./middleware/middleware-response');

let app = express();

//使用自定义加强response中间件
app.use(mdres);
//自定义中间件校验token
app.use(require('./middleware/middleware-token'));


// 解析json格式的数据
app.use(express.json());
app.use(morgan('combined'));
// console.log(config.PORT);


app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/product', require('./router/product'));
app.use('/order', require('./router/order'));

//全局错误处理中间件
app.use((err, req, res, next) => {
    res.doFail(err);
});

//开启服务器
app.listen(config.PORT);