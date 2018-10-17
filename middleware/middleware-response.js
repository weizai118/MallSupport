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