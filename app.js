//程序的主入口,类似springboot的入口类--->注意:引用位置要放在第一行
//补获express的异步异常
require('express-async-errors');
//目的是运行数据库
require('./db');

let config = require('./config');
let express = require('express');
let userRouter = require('./router/user');
let mdres = require('./middleware/middleware-response');
let app = express();

//使用自定义加强response中间件
app.use(mdres);

// 解析json格式的数据
app.use(express.json());

// console.log(config.PORT);


app.use('/user', userRouter);
//全局错误处理中间件
app.use((err, req, res, next) => {
    res.doFail(err);
});


//开启服务器
app.listen(config.PORT);