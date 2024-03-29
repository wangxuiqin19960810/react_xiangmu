import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

/*
添加/修改用户的form组件
 */
class UserForm extends Component {
    componentWillMount () {
        this.props.setForm(this.props.form)
      }
    render() {

        const {roles, user} = this.props
        console.log(user)
        const { getFieldDecorator } = this.props.form
        
        // 指定Item布局的配置对象
        const formItemLayout = {
          labelCol: { span: 4 },  // 左侧label的宽度
          wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }
    
        return (
          <Form {...formItemLayout}>
            <Item label='用户名'>
              {
                getFieldDecorator('username', {
                  initialValue: user.username,
                  rules: [
                    { required: true, message: '必须输入用户名' }
                  ]
                })(
                  <Input placeholder='请输入用户名'/>
                )
              }
            </Item>
    
            {
                // 密码有值就不显示，没值
              user._id ? null : (
                <Item label='密码'>
                  {
                    getFieldDecorator('password', {
                      initialValue: user.password,
                      rules: [
                        { required: true, message: '必须输入密码' }
                      ]
                    })(
                      <Input type='password' placeholder='请输入密码' />
                    )
                  }
                </Item>
              )
            }
    
            <Item label='手机号'>
              {
                getFieldDecorator('phone', {
                  initialValue: user.phone,
                  rules: [
                    { required: true, message: '必须输入手机号' }
                  ]
                })(
                  <Input placeholder='请输入手机号'/>
                )
              }
            </Item>
            <Item label='邮箱'>
              {
                getFieldDecorator('email', {
                  initialValue: user.email,
                })(
                  <Input placeholder='请输入邮箱'/>
                )
              }
            </Item>
    
            <Item label='角色'>
              {
                getFieldDecorator('role_id', {
                  initialValue: user.role_id,
                  rules: [
                    { required: true, message: '必须指定角色' }
                  ]
                })(
                  <Select>
                    {
                      roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                    }
                  </Select>
                )
              }
            </Item>
          </Form>
        )
      }
}

export default Form.create()(UserForm)