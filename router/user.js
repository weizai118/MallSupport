let userService = require('../service/user');
let express = require('express');
let config = require('../config');
let encryptUtil = require('../utils/encryptUtil');

let router = express.Router();

//用户注册
router.post('/regist', async (req, res) => {
    let body = req.body;
    let result = await userService.regist(body);
    res.doSucess(result);
});


//根据用户名查找用户
router.get('/:username', async (req, res) => {
    let username = req.params.username;
    let result = await userService.findUserByUsername(username);
    res.doSucess(result);
});

//根据用户名删除某个用户
router.delete('/:username', async (req, res) => {
    let username = req.params.username;
    await userService.deleteUserByUsername(username);
    res.doSucess();
});

//登录功能
router.post('/login', async (req, res) => {
    let user = await userService.login(req.body);
    /*把token作为中间件还存在一些问题,需要修改!*/
    // let aesEncrypt = res.getToken();
    // res.doSucess(aesEncrypt);
    //定义token
    let token = {
        username: user.username,
        //给token定义有效期时间
        expire: Date.now() + config.TOKEN_EXPIRE
    };
    //采用对称加密加密token;参数一:token字符串值;参数二:自定义的token_key
    let aesEncrypt = encryptUtil.aesEncrypt(JSON.stringify(token), config.TOKEN_KEY);
    res.doSucess(aesEncrypt)
});


module.exports = router;