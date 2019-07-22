import React, { Component } from 'react'

import {
    Card,
    Icon,
    Form,
    Select,
    Button,
    Input,
    message
} from 'antd'
import LinkButton from '../../components/link-button'
import memoryutils from '../../utils/memoryutils'
import PicturesWall from './picturesWall'
import RichTextEditor from './rich-text-editor'
//获取所有分类
import { reqCategroys,reqAddUpdateProduct} from '../../api';


const Item = Form.Item
const Option = Select.Option
class ProductAddUpdate extends Component {
    state = {
        categorys: []
    }
    constructor(props) {
        super(props);
        //创建ref容器, 并保存到组件对象
        this.pwRef = React.createRef();
        this.detailRef = React.createRef()
    }

    // 点击按钮进行表单统一验证
    handleSubmit = (e) => {
        // 阻止事件的默认行为(提交表单)
        e.preventDefault()
        //统一表单验证
        this.props.form.validateFields(async(err, values) => {
            console.log(values)//{name: "王秀琴", desc: "222", price: "12", categoryId: "5d2fd5c0326acf4bac87e493"}
            if (!err) {
                const { name, desc, price, categoryId } = values
                //收集上传的图片文件名数组
                const imgs = this.pwRef.current.getImgs()
                console.log('imgs', imgs)
                //获取输入的详情detail
                const detail = this.detailRef.current.getDetail()
                console.log('detail', detail)

                //发送添加商品或修改商品的请求
                const product = { name, desc, price, categoryId,imgs,detail}
                if(this.isUpdate){
                    product._id = this.product._id
                }
                const result = await reqAddUpdateProduct(product)
                if(result.status===0){
                    message.success(`${this.isUpdate?'修改':'添加'}商品成功`)
                    //跳转路由
                    this.props.history.replace('/product')
                }

            }
        })
    }

    getCategorys = async () => {
        const result = await reqCategroys();
        if (result.status === 0) {
            const categorys = result.data
            //更新状态
            this.setState({
                categorys
            })
        }

    }
    /*
     对价格进行自定义验证
     */
    validatePrice = (rule, value, callback) => {
        if (value === '') {
            callback();
        } else if (value <= 0) {
            callback('价格必须大于0')
        } else {
            callback()
        }
    }

    componentWillMount() {
        //将product，isUpdate都放到this身上，方便取
        this.product = memoryutils.product//product可能有值，可能为{}
        this.isUpdate = !!this.product._id//将一个数据强制转换为对应的布尔值
    }
    componentDidMount() {
        //获取所有分类更新
        this.getCategorys()

    }

    render() {
        const { categorys } = this.state;
        const { getFieldDecorator } = this.props.form
        const { product, isUpdate } = this

        /* 
             {
            "status": 1,
            "imgs": [
                "image-1559467198366.jpg"
            ],
            "_id": "5cf394d29929a304dcc0c6eb",
            "name": "商品A",
            "desc": "一个笔记本",
            "price": 11111,
            "detail": "<p><strong>abc</strong></p>\n",
            "categoryId": "5ca9db78b49ef916541160ca",
            "__v": 0
        }
        */
        // console.log(product)

        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' onClick={() => { this.props.history.goBack() }} />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        //指定Form表单中I tem的布局
        const formLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 }
        }
        return (
            <Card title={title} >
                <Form {...formLayout} onSubmit={this.handleSubmit}>
                    <Item label="商品名称">
                        {getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [{ required: true, message: '商品名称必须输入' }],
                        })(<Input type='text' placeholder='请输入商品名称' />)}
                    </Item>
                    <Item label="商品描述">
                        {getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [{ required: true, message: '商品描述必须输入' }],
                        })(<Input type='text' placeholder='请输入商品描述' />)}
                    </Item>
                    <Item label="商品价格">
                        {getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [
                                { required: true, message: '必须输入价格!' },
                                { validator: this.validatePrice }
                            ],
                        })(<Input type='number' placeholder='请输入商品价格' addonAfter="元" />)}
                    </Item>
                    <Item label="商品分类">
                        {getFieldDecorator('categoryId', {
                            initialValue: product.categoryId || '',//又可能product没值，这是让其匹配未选择
                            rules: [
                                { required: true, message: '必须输入商品分类!' }
                            ],
                        })(
                            <Select>
                                <Option value=''>未选择</Option>
                                {
                                    categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        )}
                    </Item>
                    <Item label="商品图片">
                        {/* 
                            ref={this.pwRef}
                            将容器交给需要标记的标签对象, 在解析时就会自动将标签对象保存到容器中(属性名为: current, 属性值标签对象) 
                            imgs={product.imgs}
                            一开始商品图片S是不显示的，将商品图片imgs交给picturesWall去显示
                        */}

                        <PicturesWall ref={this.pwRef} imgs={product.imgs} />{/* */}
                    </Item>
                    <Item label="商品详情" wrapperCol={{ span: 20 }}>
                        {/* 
                            ref={this.detailRef}
                            将容器交给需要标记的标签对象, 在解析时就会自动将标签对象保存到容器中(属性名为: current, 属性值标签对象) 
                            detail={product.detail}
                            一开始商品详情是不显示的，将商品详情detail交给富文本编辑器去显示
                        */}
                        <RichTextEditor ref={this.detailRef} detail={product.detail} />{/* 交给富文本编辑器去显示 */}
                    </Item>
                    <Item >
                        <Button type='primary' htmlType='submit'>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)