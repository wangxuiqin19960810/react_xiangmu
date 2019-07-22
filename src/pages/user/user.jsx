import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import { formateDate } from "../../utils/dateUtils"
import LinkButton from "../../components/link-button/index"
import UserForm from './userForm'
import { reqUsers, reqAddOrUpdateUser, reqDeleteUser } from '../../api'
/**
 * 用户管理
 */
export default class User extends Component {
  state = {
    user: [],//所有用户列表
    roles: [],//所有角色列表
    isShow: false//是否显示确认框
  }
  /*
  显示添加界面
  */
  showAdd = () => {
    this.user = null // 去除在修改界面时保存的user
    this.setState({ isShow: true })
  }

  /*
  显示修改界面
  */
  showUpdate = (user) => {
    this.user = user // 保存user
    this.setState({
      isShow: true
    })
  }
  // 初始化显示所有列
  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },

      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        //在roles中找到rold_id对应的role,然后要role.name
        // render: (role_id) => this.state.roles.find((role) => role._id === rold_id).name
        render: (role_id) => this.roleNames[role_id]


      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }
  // 获取所有用户列表
  getUsers = async () => {
    const result = await reqUsers();
    const { users, roles } = result.data
    if (result.status === 0) {
      message.success('获取所有用户列表成功')
      //生成一个对象容器（属性名:角色的ID值，属性值是角色）
      this.roleNames = roles.reduce((pre, role) => {
        //ID值是不固定的
        pre[role._id] = role.name
        return pre
      }, {})

      //更新状态
      this.setState({
        users,
        roles
      })
    } else {
      message.error(result.msg)
    }
  }

  /* 
  添加/更新用户
  */
  addOrUpdateUser = async () => {
    //隐藏模态框
    this.setState({ isShow: false })
    //进行统一表单验证
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //如果this没有user
        if (this.user) {
          values._id = this.user._id
        }
        const result = await reqAddOrUpdateUser(values);
        if (result.status === 0) {
          message.success(`${this.user ? '更新' : '添加'}` + '用户成功')
          //重新获取用户列表
          this.getUsers()
        } else {
          message.error(result.msg)
        }
      }
    })
  }

  /* 删除指定用户 */
  deleteUser = (user) => {
    Modal.confirm({
      title: `确定删除用户${user.username}?`,

      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success(`删除用户成功`)
          //重新获取用户列表
          this.getUsers()
        } else {
          message.error(result.msg)
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }


  componentDidMount() {
    this.getUsers()
  }

  componentWillMount() {
    this.initColumns()
  }
  render() {
    const { users, roles, isShow } = this.state
    const user = this.user || {}
    const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={users}
          columns={this.columns}
          pagination={{ defaultPageSize: 2 }}
        />

        <Modal
          title={'添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.form.resetFields()
            this.setState({ isShow: false })
          }}
        >
          <UserForm
            setForm={form => this.form = form}
            roles={roles}
          user={user}
          />
        </Modal>

      </Card>
    )
  }
}
