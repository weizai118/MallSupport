//引入model层的User
let User = require('../model/user');
let encryptUtil = require('../utils/encryptUtil');

/**
 * 添加用户,用户注册
 * @param user 格式:{username:"咚咚锵",password:"123"}
 * @returns {Promise<void>}
 * @test : test层测试Good
 */
async function regist(user) {
    let result = await User.findOne({username: user.username});
    if (result) {
        throw Error(`该用户名${user.username}已被占用,请重新输入用户名`)
    }
    /**
     * 作用:将密码转为密文;
     * param1:用户密码;param2:盐(这里使用用户名进行作为盐)
     */
    user.password = encryptUtil.md5Hmac(user.password, user.username);
    //为防止注册人员随意修改权限,这里讲role置0后再添加用户
    user.role = 0;
    //添加用户
    user = await User.create(user);
    //因为不能将密码直接返回,需要将密码置空
    user.password = '';
    return user;
}


//根据用户名获取某个用户
//TODO : 此处的逻辑还存在疑问!!!
async function findUserByUsername(username) {
    let result = await User.findOne({username: username});
    if (result === null) {
        throw Error(`您查找的用户名${username}不存在,请确认用户名`)
    }
    //因为不能将密码直接返回,需要将密码置空
    result.password = '';
    return result;
}

/*--------根据用户名检查该用户名是否已经存在,如果存在就抛出错误---------*/


//不存在
async function isNotExistByUsername(username) {
    let result = await User.findOne({username: username});
    if (!result) {
        throw Error(`该用户名${username}不存在,请重新输入用户名`)
    }
}


//登录功能
async function login(user) {
    await isNotExistByUsername(user.username);
    let passowrd = user.password;
    if (passowrd == null && passowrd.trim().length == 0) {
        throw Error('密码不能为空')
    }
    //将用户输入的密码加密
    user.password = encryptUtil.md5Hmac(user.password, user.username);
    //根据输入的用户名查找用户
    user = await User.findOne(user);
    //因为不能将密码直接返回,需要将密码置空
    user.password = '';
    return user;
}


//根据用户名删除某个用户
async function deleteUserByUsername(username) {
    await isNotExistByUsername(username);
    let result = await User.deleteOne({username: username});
    if (result.n !== 1) {
        throw Error(`删除用户${username}操作失败`)
    }
}


module.exports = {
    regist,
    findUserByUsername,
    login,
    deleteUserByUsername
};