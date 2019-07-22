import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'

import menuList from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree
/* 
添加分类的form组件
*/
export default class AuthForm extends Component {
    static propTypes = {
        role: PropTypes.object
    }
    state = {
        checkedKeys:[]//c存储所有选中的keyS
    }

    getMenus = ()=> this.state.checkedKeys


    //根据菜单配置menuList数据数组，动态生成TreeNode标签数组
    getTreeNodes = (menuList)=>{
        return menuList.reduce((pre,item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {
                        item.children ? this.getTreeNodes(item.children) : null
                    }
                </TreeNode>
            )
            return pre
        },[])
    }
    /*
    进行勾选操作时的回调函数
    checkedKeys:最新的勾选node的key的数组
     */
    handleCheck = (checkedKeys)=>{
        console.log(checkedKeys)
        this.setState({
            checkedKeys
        })
    }

    componentWillMount(){
        console.log('componentWillMount()')
        this.treeNodes = this.getTreeNodes(menuList)
        //根据传入的menus来显示checkedKeys的状态
        const menus = this.props.role.menus
        // console.log(menus)
        this.setState({
        checkedKeys:menus
        })
    }

    /*
    组件接收到新的标签属性时就会执行（第一次render之前不会调用） 
     */
    componentWillReceiveProps(nextProps){
        // console.log('componentWillReceiveProps()' ,nextProps)
        const menus = nextProps.role.menus
        this.setState({
        checkedKeys:menus
        })
    }
    render() {
        const { role } = this.props
        const {checkedKeys} = this.state
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 }
        }
        return (
            <Form>
                <Item label="设置角色权限" {...formItemLayout}>
                    <Input type='text' value={role.name} disabled />{/* disabled默认不让修改 */}
                </Item>
                <Tree
                    checkable//是否支持选中
                    defaultExpandAll//默认展开所有树节点
                    checkedKeys={checkedKeys}//默认选中的复选框节点
                    onCheck={this.handleCheck}
                >
                    <TreeNode title="平台权限" key='all'>
                        {
                            this.treeNodes
                        }
                    </TreeNode>
                </Tree>
            </Form>
        )
    }
}
