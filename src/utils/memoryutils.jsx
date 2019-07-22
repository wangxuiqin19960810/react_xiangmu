import storageUtils from "./storageUtils";
//初始时取一次，并保存为user
const user = storageUtils.getUser()
export default {
    user, //用来保存用户登录的信息，初始值为在localstoreage中读取的user
    product:{}//需要查看的商品对象，保存在内存中，在任何地方都可以查看
}