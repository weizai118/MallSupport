/*---------------------校验token中间件-------------------*/
let encryptUtil = require('../utils/encryptUtil');
let config = require('../config');
let userService = require('../service/user');

//定义一个方法检验url,根据url来判断是否校验token
function verfiyToken(url) {
    // console.log(url);//  /user/regist
    //定义数组,用来存储不需要校验token的路径
    //登录和注册的路径不需要校验token
    let ignoreUrls = [
        /\/user\/regist/,
        /\/user\/login/,
    ];
    //定义一个旗帜变量
    let needVerfiyFlag = true;
    //遍历ignoreUrls数组中的url来与req中的url进行比较
    for (let i = 0; i < ignoreUrls.length; i++) {
        let ignoreUrl = ignoreUrls[i];
        if (ignoreUrl.test(url)) {
            needVerfiyFlag = false;
            break;
        }
    }
    return needVerfiyFlag;
}

module.exports = (req, res, next) => {

    let url = req.url;
    let flag = verfiyToken(url);
    if (flag) {
        //需要对url进行校验,如果需要校验
        // console.log('需要对url进行校验'+url);
        //1.取出token
        let token = req.get('token');
        //2.判断是否有token,如果没有抛出错误
        if (!token) {
            throw Error('没有token,请重新登录或注册')
        }
        let aesDecrypt = null;
        //如果有token,需要判断token是否过期
        try { //将已经加密的token解密
            aesDecrypt = encryptUtil.aesDecrypt(token, config.TOKEN_KEY);
        } catch (e) {
            throw Error('token解密错误,请重新登录');
        }
        //得到的aesDecrypt是一个字符串,需要将其转换为JSON对象才可以方便的取出其中的expire
        let tokenJS = JSON.parse(aesDecrypt);
        //获取token的有效期
        let expire = tokenJS.expire;
        if (Date.now() > expire) {
            throw Error('token已过期,请重新的登录')
        }
        //如果token没有过期,就需要对用户名进行判断
        let username = tokenJS.username;
        //根据用户名查询用户
        let user = userService.findUserByUsername(username);
        if (!user) {
            throw Error('用户名不存在,请重新登录')
        }
        //如果username合法,查询到了user,name把user存储到request对象上
        req.user = user;
    }
    next()
};