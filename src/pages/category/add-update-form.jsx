import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Form, Input } from 'antd'


class AddUpdateForm extends Component {
    static propTypes={
        //AddUpdateForm通过setForm属性传递数据的时候，必须是function类型，否则出现错误警告
        setForm:PropTypes.func.isRequired,
        categoryName:PropTypes.string
    }
    componentWillMount(){
        this.props.setForm(this.props.form);
    }
    render() {

        const { getFieldDecorator } = this.props.form;
        const {categoryName}  = this.props
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue:categoryName || '',
                            role: [
                                { required: true, message: '分类名称必须填写' }
                            ]
                        })(
                            <Input type="text" placeholder='请输入分类名称'/>
                        )
                    }
                </Form.Item>
            </Form>
        ) 
    }
}
//给addUpdateForm组件添加一个父组件，父组件会向addUpdateForm传递一个form属性，
//form属性值是一个对象，里面有很多方法
export default Form.create()(AddUpdateForm)