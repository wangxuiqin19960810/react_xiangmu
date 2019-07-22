import React, { Component } from 'react'
import { Form,Input} from 'antd';
import PropTypes from 'prop-types'
const Item = Form.Item;
/* 
    用来添加角色的form组件
*/
class AddForm extends Component {
    static propTypes = {
        setForm:PropTypes.func.isRequired
    }
    componentWillMount(){
        //将from属性通过setForm()传给子组件
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol:{ span: 5 },
             wrapperCol:{ span: 16}
        } 
        return (
            <Form >
                <Item label="角色名称" {...formItemLayout}>
                    {getFieldDecorator('roleName', {
                        initiavalue:'',
                        rules: [{ required: true, message: '必须输入角色名称' }],
                    })(
                        <Input type='text' placeholder='请输入角色名称'/>,
                    )}
                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)