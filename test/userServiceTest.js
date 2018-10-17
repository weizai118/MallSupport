require('../db');
let userService = require('../service/user');

async function userServiceTest() {
    let user = {
        username: "alice",
        password: '123',
        age: 16,
    };

    //注册测试 OK
    let res = await userService.regist(user);
    console.log(res);

    //查找测试 OK
    // let res = await userService.findUserByUsername('齐德龙6');
    // let res = await userService.findUserByUsername('德齐龙');
    // console.log(res);

    //登录测试 OK
    // let res = await userService.login(user);
    // console.log(res);

    //删除测试 OK
    // await userService.deleteUserByUsername('齐德龙')


}

userServiceTest();