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