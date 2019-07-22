import React, { Component } from 'react';
import { Form, Icon, Input, Button,message } from 'antd';
import {Redirect} from 'react-router-dom'

import {reqLogin}  from '../../api'
import storageUtils  from '../../utils/storageUtils';
import memoryutils  from '../../utils/memoryutils';
import logo from '../../assets/images/logo.png';
import bg from './images/bg.jpg';
import './login.less'
class Login extends Component {
    

    handleSubmit = e => {
        e.preventDefault();//阻止事件的默认行为，阻止表单的提交
        // alert('发送ajax验证');
        //通过form属性取出用户输入的相关数据
        // const form =this.props.form
        // const values = form.getFieldsValue();
        // const username = form.getFieldValue('username');
        // const password = form.getFieldValue('password');
        // console.log(values,username,password);//{username: "admin", password: "1234"} "admin" "1234"
        
        //点击提交按钮对表单所有字段进行统一验证
        //values是所有搜集的数据{username，password}
        this.props.form.validateFields(async(err, {username,password}) => {
            // console.log(values);//{username: "12345", password: "222222"}
            // let {username,password} = {username: "12345", password: "222222"}
            // if (!err) {

            // 验证成功后发送ajax请求
            //   alert(`发送Ajax请求111,username=${username},password=${password}`);
            const reuslt = await reqLogin(username,password)//reqLogin()返回值是promise对象
            //看是否和接口文档一致
            
                if(reuslt.status === 0){//登录成功,跳转到admin管理界面
                    //将user的信息，保存到localStorage中
                    const user = reuslt.data;
                    // localStorage.setItem('user_key',JSON.stringify(user));//转换成JSON格式的字符串
                    storageUtils.saveUser(user);
                    //在内存中保存user
                    //内存中user要想有信息，有两种途径：
                    // 1.昨天登陆过，关闭浏览器后内存中没了，但localstoreage中有，
                         // 再次打开浏览器时，内存中user的初始值就是从localstoreage中读的，所有内存中一上来就有 
                    // 2.从未登录过，内存中没有，通过登录界面进行登录就有了，就将user保存到内存中了
                    memoryutils.user = user;

                    this.props.history.replace('/')
                    message.success('登录成功')
                }else{//登录失败
                    message.error(reuslt.msg)
                }
            



            // }else{
            //     alert('验证失败')
            // }
          });




    };
    /*
      对密码进行自定义验证
     */
      validator = (rule,value,callback)=>{
        // 1).必须输入
        // 2).必须大于等于4位
        // 3).必须小于等于12位
        // 4).必须是英文、数字或下划线组成
         value = value.trim();
        if(!value){
            callback('密码是必须的')
        }else if(value.length<4){
            callback('密码不能小于四位')
        }else if(value.length>12){
            callback('密码不能大于12位')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('必须是英文、数字或下划线组成')
        }else{
            callback()//验证通过
        }
      }

      

    render() {
        //读取user，如果存在，直接跳转到管理界面
        // const user= JSON.parse(localStorage.getItem('user_key') || '{}');//将JSON格式的字符串转换成对象
        // const user = storageUtils.getUser()
        const user = memoryutils.user
        
        if(user._id){//说明已经登录
            //跳转到管理界面
            // this.props.history.replace('/login')事件;回调函数中路由的跳转
            return <Redirect to={'/'}/> //render()渲染时自动跳转到指定的路由组件
        }

        const Item = Form.Item;
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="login" src={bg} alt={"资源记载失败"}>
                <header className="login-header">
                    <img src={logo} alt={"资源记载失败"} />
                    <h1>后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h1>用户登录</h1>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {/* 先收集数据，再做验证 */}
                            {/* 'username'：指定当前用于收集数据的标识名称 */}
                            {
                                getFieldDecorator('username', {//配置对象：属性名是一些特定的名称。不能改变
                                    rules: [
                                        //实时验证：
                                            // 1).必须输入
                                            // 2).必须大于等于4位
                                            // 3).必须小于等于12位
                                            // 4).必须是英文、数字或下划线组成
                                            { required: true, message: '用户名必须的' },
                                            { min : 4,message:'用户名不能小于四位'},
                                            { max : 12,message:'用户名不能大于12位'},
                                            {pattern : /^[a-zA-Z0-9_]+$/, message:'用户名必须是英文、数字或下划线组成'}
                                        ],
                                    })(
                                        <Input
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="用户名"
                                        />
                                )
                            }
                        </Item>
                        <Item>
                            {getFieldDecorator('password', {
                                initialValue: '', //初始值为空
                                rules: [
                                  //自定义验证：  
                                    {validator:this.validator}
                                ],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />
                            )}
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登 录
                            </Button>
                        </Item>
                    </Form>

                </section>
            </div>

        )
    }
}
/*
理解Form组件:包含<Form>的组件
    利用Form.create()包装Form组件生成一个新的组件
    新组件会向Form组件传递一个强大的属性，属性名：form,属性值：对象

高阶函数
    定义：接受的参数是函数或者返回值是函数
    常见的：数组遍历相关的方法/定时器/Promise/高阶组件
    作用：实现一个更加强大的，动态的功能
高阶组件：
    本质是一个函数
    函数接收一个组件，返回一个新的组件
    Form.create()返回的就是一个高阶组件
组件
    组件类：本质就是一个构造函数，定义组件：class/function
    组件对象:组件类的实例，也就是构造函数的实例，<MyLink><.MyLink>
 */

    
const wrapperLoginForm = Form.create()(Login);
export default wrapperLoginForm;//<Form(Login)/>