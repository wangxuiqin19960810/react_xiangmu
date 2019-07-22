import React, { Component } from 'react'
import { Modal} from 'antd';
import {withRouter} from 'react-router-dom';

import memoryutils from '../../utils/memoryutils'
import storageUtils from '../../utils/storageUtils'
import menulist from '../../config/menuConfig'
import {formateDate} from '../../utils/dateUtils'
import {reqWeather} from '../../api/'
import './index.less';
import LinkButton from '../link-button/index'

const { confirm } = Modal;

 class Header extends Component {
     state = {
         time:formateDate(Date.now()),
         dayPictureUrl:'',
         weather:''
     }
    
    //点击退出，退出登录
    logout = ()=>{
        //显示模态框
        confirm({
            title: '确定退出登录嘛',
            onOk:()=>{
               //点击确定，删除localStroeage和内存中的用户信息
               storageUtils.removeUser();
               memoryutils.user = {}
               //跳转到登录界面
               this.props.history.replace('/login');
            },
            onCancel() {
             //点击取消，模态框隐藏
              console.log('cancel');
            },
          });
    }
    //判断当前路由的location.pathname是否等于menulist数组中每一项的key,
    //如果相等，则当前显示的title为此key对应的item的title
    //因为有二级菜单，需要一层一层遍历，判断每一个item
    getTitle = () =>{
        const path = this.props.location.pathname
        let title = '';
        menulist.map((item)=>{
            if(item.key === path){
                title = item.title;
            }else if(item.children){
                const cItem = item.children.find((cItem)=> cItem.key=== path)
                if(cItem){
                    title = cItem.title;
                }
            }
        })
        return title;
    }

    //发送jsonp请求，得到天气信息
    getWeather = async()=>{
        const result = await reqWeather('北京');
        //取出天气信息
        const {dayPictureUrl,weather} = result;
        //更新状态
        this.setState({
            dayPictureUrl,
            weather
        })
    }

    componentDidMount(){
        //启动定时器
        this.timer = setInterval(()=>{
            this.setState({
                time:formateDate(Date.now())
            })
        },1000)

        //发送jsonp请求，得到天气信息
        this.getWeather();
    }
    //清除定时器
    componentWillUnmount(){
        clearInterval(this.timer);
    }
    
    render() {
        const user = memoryutils.user;
        //得到当前需要显示的title
        const title = this.getTitle()

        let {time,dayPictureUrl,weather} = this.state;
        return (
            <div className ='header'>
                <div className='header-top'>
                    <span>欢迎 {user.username}</span> 
                    {/* 組件的标签体作为标签的children属性传入 */}
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        <span>{title}</span>
                    </div>
                    <div className='header-bottom-right'>
                        <span>{time}</span>
                        <img src={dayPictureUrl} alt="Weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header);