//引入model层的User
let User = require('../model/user');
let encryptUtil = require('../utils/encryptUtil');

/**
 * 添加用户,用户注册
 * @param user 格式:{username:"咚咚锵",password:"123"}
 * @returns {Promise<void>}
 */
async function regist(user) {
    isExistByUsername(user.username);
    /**
     * 作用:将密码转为密文;
     * param1:用户密码;param2:盐(这里使用用户名进行作为盐)
     */
    let password = encryptUtil.md5Hmac(user.password, user.username);
    //为防止注册人员随意修改权限,这里讲role置0后再添加用户
    user.role = 0;
    //添加用户
    let result = await User.create(user);
    return result;
}


//根据用户名获取某个用户
async function findUserByUsername(username) {
    let result = await User.findOne({username: username});
    if (result === null) {
        throw Error(`您查找的用户名${username}不存在,请确认用户名`)
    }
    return result;
}

/*--------根据用户名检查该用户名是否已经存在,如果存在就抛出错误---------*/

//已经存在
async function isExistByUsername(username) {
    let result = await User.findOne({username: username});
    if (result) {
        throw Error(`该用户名${username}已被占用,请重新输入用户名`)
    }
}

//不存在
async function isNotExistByUsername(username) {
    let result = await User.findOne({username: username});
    if (!result) {
        throw Error(`该用户名${username}不存在,请重新输入用户名`)
    }
}


//登录功能
//TODO:登录功能仍需进行逻辑完善
async function login(user) {
    isNotExistByUsername(user.username);
    //将用户输入的密码加密
    user.password = encryptUtil.md5Hmac(user.password, user.username);
    //根据输入的用户名查找用户
    user = await User.findOne(user);
    return user;
}


//根据用户名删除某个用户
async function deleteUserByUsername(username) {
    isExistByUsername(username);
    let result = await User.deleteOne({username: username})
    if (result.n !== 1) {
        throw Error(`删除用户${username}操作失败`)
    }
}
