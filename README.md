
**1.引入模块**
    npm i body-parser express express-async-errors mongoose morgan

**2.搭建环境**

    -package.json       ---> 记录引入的模块以及版本号
    -app.js             ---> 入口类/启动类
    -db.js              ---> 连接数据库
    -config
        -dev.js         ---> 开发环境配置
        -prod.js        ---> 生产环境配置
        -index.js       ---> 根据环境配置选择开发模式或生产模式
    -model
        -user.js
        -...
    -service
        -user.js
        -...
    -utils
        -encryptUtil.js ---> 将密码加密为密文的工具类
    -test               ---> 测试service层
        -userServiceTest.js
        -...
    -router
        -user.js
        -...
