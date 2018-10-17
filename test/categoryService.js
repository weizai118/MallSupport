require('../db');

let categoryService = require('../service/category');


async function testCategory() {
    let category = {
        name: "衣服鞋子"
    };
    //添加测试 OK
    // let res = await categoryService.addCategory(category);
    // console.log(JSON.stringify(res));

    //更新测试 OK
    // await categoryService.updateCategoryByName("5bc728a21f58913770ab8062",category)

    //删除测试 OK
    // await categoryService.deleteCategoryByName("5bc728a21f58913770ab8062")

    //安页数获得种类名称测试
    let result = await categoryService.getCategoryByPage(0);
    console.log(result);
}

testCategory();