//获取环境变量中NODE_ENV的值
let nodeEnv = process.env.NODE_ENV;

let config = null;

if (nodeEnv === 'production') {
    //如果等于prod,配置文件就获取prod中的配置
    config = require('./prod')
} else {
    //如果不等,就获取dev配置文件中的配置
    config = require('./dev');
}

//导出
module.exports = config;