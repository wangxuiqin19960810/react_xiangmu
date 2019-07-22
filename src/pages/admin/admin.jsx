import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';

import memoryutils from '../../utils/memoryutils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout;
export default class Admin extends Component {
    render() {
        //读取user，如果不存在，直接跳转到登录界面
        // const user= JSON.parse(localStorage.getItem('user_key') || '{}');//将JSON格式的字符串转换成对象
        // const user = storageUtils.getUser()
        const user = memoryutils.user

        if (!user._id) {//说明没有登录
            //跳转到登录界面
            // this.props.history.replace('/login')事件;回调函数中路由的跳转
            return <Redirect to={'/login'} /> //render()渲染时自动跳转到指定的路由组件
        }
        return (
            <Layout style={{ height: '100%' }}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header />
                    <Content style={{ background: 'white',margin:'20px'}}>
                        {/* 注册二级路由 */}
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Redirect to='/home'/>
                        </Switch>

                    </Content>
                    <Footer style={{ textAlign: "center", background: 'rgba(0,0,0,0.2)' }}>
                        推荐使用谷歌浏览器，可以获得更佳页面操作体验
                    </Footer>
                </Layout>
            </Layout>

        )
    }
}