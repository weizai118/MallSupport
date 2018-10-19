项目源代码:

# 一.安装模块

我的package.json展示如下:

npm install 下面的模块即可.

```json
{
  "name": "MallSupport01",
  "version": "1.0.0",
  "dependencies": {
    "big.js": "^5.2.2",
    "body-parser": "^1.18.3",
    "express": "^4.16.4",
    "express-async-errors": "^3.1.1",
    "mongoose": "^5.3.4",
    "morgan": "^1.9.1"
  }
}
```

# 二.搭建基本结构

1.model层:定义要存储的对象的字段和结构,与mongodb关联(类似spring中的bean和dao层合并);

2.service层:类似spring中的service层,处理具体的CRUD逻辑;

3.test层:用来测试service层的逻辑(service层中每一个模块逻辑完成后都需要在test层中测试);

4.router层:定义CRUD对应的请求方式(GET/POST/DELETE/PUT),以及请求路径;

5.config层:定义出开发环境和生产环境使用的不同参数,也就是动态环境的切换;(如端口号,分页显示数量,数据库名称,Token有限期时间等);

6.app.js:相当于spring中的application启动类(里面需要定义应用层级的中间件,调用不同router以及定义不同router的路径,加载数据库,使用日志,使用加强中间件,全局错误处理,JSON数据格式解析模块引用,错误捕获,服务器启动等);

7.db.js:连接数据库;

8.middleware层:自定义加强中间件(如自定义token校验加强中间件,权限校验加强中间件,response对象方法加强等;)

9.utils层:需要使用的工具类(如加密解密工具类);

10.deploy.yml:配置项目集群设置(集群名称,最大数量,检测状态,系统环境等);

# 三.项目中注意事项总结

1.用户注册时,密码的应为密文,以及权限重设(role=0)

```javascript
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
```

2.router层的用户登录操作时,token值的添加

```javascript
//登录功能
router.post('/login', async (req, res) => {
    let user = await userService.login(req.body);
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
```

3.model层定义bean时,type: mongoose.Schema.Types.ObjectId的使用

```javascript
let mongoose = require('mongoose');
let productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '商品名不能为空'],
        unique: [true, '商品名不可重复']
    },
    price: {
        type: String,
        required: [true, '商品价格不能为空'],
    },
    //存货量
    stock: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, '分类id不能为空']
    },
    description: {
        type: String
    },
    isOnSale: {
        type: Boolean,
        default: true
    },
    createTime: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('products', productSchema);
```

4.将每次响应(response)返回内容加强,自定义中间件加强response对象

```javascript
/*---自定义中间件,加强response doSucess()和doFail()方法*/
module.exports = (req, res, next) => {

    res.doSucess = (result) => {
        res.send({
            code: 1,
            msg: '操作成功',
            data: result
        })
    };

    res.doFail = (err) => {
        res.send({
            code: -1,
            msg: '操作失败',
            data: err.toString()
        })
    };

    next();

};
```

5.分页查询公式注意

```javascript
/**
 * 获取每页的商品种类数据
 * @param page
 * @returns {Promise<void>}
 * TODO
 */
async function getCategoryByPage(page = 1) {
    //(page-1)*size
    //skip 偏移量=每次跳过多少条数据  offset = (page-1)*size
    let offset = (page - 1) * config.PAGE_SIZE;
    //limit 每页显示多少条数据
    let result = await Category.find().skip(offset).limit(config.PAGE_SIZE);
    return result;
}
```

6.生成订单逻辑以及金钱操作保证精确度的相关注意事项(Decimal128)

```javascript
//引入第三方库big.js,用于钱的精确处理
let Big = require('big.js');
//x.div(y):除;plus(z):加;times(9):乘;minus('1.234567801234567e+8'):减;
//生成订单
async function add(order) {
    //订单:包含商品id,商品名称,商品单价,商品数量,价格小计(商品单价*商品数量)
    //1.根据商品id查找商品是否存在
    //获取订单id的产品
    let product = await productService.getProductById(order.productId);
    //判断商品是否存在
    if (!product) {
        throw Error(`id为${order.productId}的商品不存在`)
    }

    //给商品名和价格重新赋值
    order.productName = product.name;
    order.productPrice = product.price;

    //2.如果商品存在,判断订单中商品的数量和该商品的库存数量
    if (order.count > product.stock) {
        throw Error(`当前存货量不足,最多只能购买${product.stock}个`)
    }
    //3.库存如果足够的话,计算价格(注意:这里的单价需要使用product.price)
    let price = product.price;
    let total = Big(price).times(order.count);
    //price是String类型 涉及到钱的需要使用Decimal128
    order.total = total;
    //4.生成订单
    let getOrder = await Order.create(order);
    //5.扣减库存数量!!!!!!!!!!!!!!!!!
    await productService.updateProductById(order.productId, {stock: product.stock - order.count});
    return getOrder;
}
```

7.自定义token校验的实现逻辑

```javascript
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
```

8.自定义权限管理校验中间件实现逻辑

```javascript
/*---------------------校验权限中间件-------------------*/

//定义一个数组,用来存放不同权限的用户,使其访问权限不同
let permissions = [
    {
        role: 0,//普通用户
        urls: [
            /\/category.*/,
            /\/product.*/,
            /\/order.*/
        ]
    },
    {
        role: 100,//管理员
        urls: [
            /.*/
        ]
    }
];

module.exports = (req, res, next) => {

    //将request中的user取出来
    let user = req.user;
    //取出request中的url;
    let reqUrl = req.url;

    outer:for (let i = 0; i < permissions.length; i++) {
        //定义旗帜变量,默认false,没有权限访问
        let isUrl = false;
        //获取权限对象
        let permission = permissions[i];
        //如果request中取出的用户是permissions中的用户对象类型,那么就行校验
        if (user === permission) {
            //如果是,需要遍历permission中的urls
            var urls = permission.urls;
            for (let j = 0; j < urls.length; j++) {
                let url = urls[i];
                //如果请求和url和遍历出来的url有相符合的情况
                if (url.test(reqUrl)) {
                    isUrl = true;
                    break outer;
                }
            }
        }
        //如果是false,则没有权限访问
        if (!isUrl) {
            throw Error('您没有权限进行操作')
        }
    }

    next()
};
```

# 四.集群搭建

1.使用pm2搭建;

2.创建文件deploy.yml;

```yml
apps:
- script: app.js
  name: mall
  instances: max
  exec_mode: cluster
  watch: true
  env:
    NODE_ENV: production
```

3.启动

```pm2
pm2 start deploy.yml
```

