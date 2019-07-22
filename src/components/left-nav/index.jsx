import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
/*
左侧路由导航组件 
 */
const { SubMenu } = Menu;
class LeftNav extends Component {

    /*
        根据指定菜单数据列表产生<Menu>的子节点数组
        使用 reduce() + 递归
    */
    getMenuNodes = (menuList) => {
        // const arr = [1,2,3,4,5];
        // return arr.reduce((pre,now)=>{//遍历的回调函数：统计，必须返回当前统计的结果
        //     return pre + (now%2===1)?now:0
        // },0)

        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
            //可能向pre添加<Menu.Item>
            if (!item.children) {
                pre.push(
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                /* 
                    判断当前item的key是否是我需要的key
                    查找item中所有的children中cItem的key,看是否有一个跟请求的path匹配
                */
                    const cItem = item.children.find(cItem =>path.indexOf(cItem.key) === 0)//看开头是否一致就行
                      if(cItem){
                          this.openkey = item.key
                      }  

                pre.push(
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                )
            }
            return pre
        }, [])

    }



    /*
        根据指定菜单数据列表产生<Menu>的子节点数组
        使用 map() + 递归
     */
    // getMenuNodes = (menuList) => {
    //     return menuList.map(item => {
    //         if (!item.children) {
    //             return (
    //                 <Menu.Item key={item.key}>
    //                     <Link to={item.key}>
    //                         <Icon type={item.icon} />
    //                         <span>{item.title}</span>
    //                     </Link>
    //                 </Menu.Item>
    //             )
    //         }
    //         return (//有下一级子菜单项
    //             <SubMenu
    //                 key={item.key}
    //                 title={
    //                     <span>
    //                         <Icon type={item.icon} />
    //                         <span>{item.title}</span>
    //                     </span>
    //                 }
    //             >
    //                 {
    //                     this.getMenuNodes(item.children)
    //                  }
    //             </SubMenu>
    //         )
    //     })
    // }

    /* 
        第一次render()之后執行，只執行一次
        做一些異步任務，發ajax請求，定時器，訂閲發佈
    */
    componentDidMount(){

    }
    /* 
        第一次render()之前執行，只執行一次
        為第一次render做一些同步的準備工作
    */
    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList);
    }

    render() {
        // console.log('render()')
        

        //得到当前请求的路径，作为选中菜单项的key
        let SelectedKey = this.props.location.pathname  //   /product/xxx
        if(SelectedKey.indexOf('/product')===0){//看开头是否一致就行
            SelectedKey = '/product'
        }
        // console.log('SelectedKey',SelectedKey)
        // console.log('openkey',this.openkey)
        return (
            <div className='left-nav'>
                <Link className='left-nav-link' to='/home'>
                    <img src={logo} alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>


                    {/* 
                        defaultSelectedKeys: 总是根据第一次指定的key进行显示
                        selectedKeys: 总是根据最新指定的key进行显示
                    */}
                <Menu
                    selectedKeys={[SelectedKey]}//根据当前请求的路径得到这个值
                    defaultOpenKeys={[this.openkey]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        //根据数据数组生成标签数组
                        this.menuNodes
                    }
                    {/* <Menu.Item key="/home">
                        <Link to='/home'>
                            <Icon type="login" />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="products"
                        title={
                            <span>
                                <Icon type="mail" />
                                <span>商品</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/category">
                            <Link to='/category'>
                                <Icon type="border-top" />
                                <span>品类管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/product">
                            <Link to='/product'>
                                <Icon type="menu-fold" />
                                <span>商品管理</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu> */}
                </Menu>
            </div>
        )
    }
}

/* 
    向外暴露，使用高阶组件withRouter()来包装非路由组件
    返回一个新组件，新组件向LeftNav传递3个特别的属性：history，location，match
    结果：LeftNav可以操作路由相关的属性了
*/
export default withRouter(LeftNav);

/*
    2个问题
    1) 默认选中对应的menuItem----defaultSelectedKeys
    2) 又可能需要默认打开某个SubMenu:访问的是某一个二级菜单项对应的path---defaultOpenKeys
*/