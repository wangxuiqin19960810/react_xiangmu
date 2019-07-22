import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'

import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import AddForm from './addForm'
import AuthForm from './authForm'
import { formateDate } from '../../utils/dateUtils'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import memoryutils from '../../utils/memoryutils'
/**
 * 角色管理
 */
export default class Role extends Component {
    state = {
        roles: [], // 所有角色的列表
        isShowAdd: false, // 是否显示添加界面
        isShowAuth: false, // 是否显示设置权限界面
    }
    constructor(props) {
        super(props)
        this.authRef = React.createRef()
    }

    /* 
  初始化table列数组
  */
    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                // render: create_time => formateDate(create_time)
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                // render: create_time => formateDate(create_time)
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
            {
                title: '操作',
                //点击设置权限时，将role对象传进来
                render: (role) => <LinkButton onClick={() => this.ShowAuth(role)}>设置权限</LinkButton>
            },
        ]
    }
    //获取子组件对象身上的form属性的方法
    setForm = (form) => {
        this.form = form
    }
    /* 添加角色 */
    addRole = () => {
        //进行表单验证，只有通过了才能发送请求
        //需要拿到form属性
        this.form.validateFields(async (err, values) => {
            if (!err) {
                //先隐藏确认框
                this.setState({
                    isShowAdd: false
                })
                //再发送请求
                const { roleName } = values
                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    //重新获取角色列表
                    message.success('添加角色成功')
                    this.getRoles()
                } else {
                    message.error(result.msg)
                }

            }
        });
    }

    /* 显示权限设置界面 */
    ShowAuth = (role) => {
        //将当前需要设置的role对象保存到组件对象this身上，方便用
        this.role = role;
        this.setState({
            isShowAuth: true
        })
    }
    /* 
    设置权限更新角色
    */
    updateRole = (async () => {
        //先隐藏确认框
        this.setState({
            isShowAuth: false
        })
        const { role } = this
        //将role对象中的属性i进行更新
        role.menus = this.authRef.current.getMenus()
        role.auth_time = Date.now()
        role.auth_name = memoryutils.user.username
        //再发送请求跟新角色
        const result = await reqUpdateRole(role)
        console.log(result)
        if (result.status === 0) {
            //重新获取角色列表
            message.success('更新角色授权成功')
            this.getRoles()
        } else {
            message.error(result.msg)
        }

    })




    /* 
    发送异步获取角色列表请求
    */
    getRoles = async () => {
        const result = await reqRoles();
        // console.lo g(result)
        if (result.status === 0) {
            const roles = result.data
            //更新状态
            this.setState({
                roles
            })
        }
    }


    componentWillMount() {
        this.initColumn()
    }
    componentDidMount() {
        this.getRoles()
    }

    render() {
        const { roles, isShowAdd, isShowAuth } = this.state
        const { role } = this
        const title = (
            <Button type='primary' onClick={() => this.setState({ isShowAdd: true })}>
                创建角色
            </Button>
        )
        return (

            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                />

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({ isShowAdd: false })
                        // this.form.resetFields()
                    }}
                >
                    <AddForm
                        // setForm={(form) => this.form = form}
                        setForm={this.setForm}
                    />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({ isShowAuth: false })
                    }}
                >
                    <AuthForm ref={this.authRef} role={role} />
                </Modal>
            </Card>
        )
    }
}
