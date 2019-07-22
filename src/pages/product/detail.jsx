import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {
    Card,
    Icon,
    List
} from 'antd'
import LinkButton from '../../components/link-button'
import memoryutils from '../../utils/memoryutils'
import {BASE_IMG} from '../../utils/constants'
import { reqCategory } from '../../api';

const Item = List.Item
export default class ProductDetail extends Component {
    state={
        categoryName:''
    }
    getCategoryId= async(categoryId)=>{
       const result = await reqCategory(categoryId);
       console.log(result)
       if(result.status===0){
        const categoryName = result.data.name
        //更新状态
        this.setState({
             categoryName
        })
       }
       
    }

    componentDidMount(){
        //根据分类id获取分类名称
        const product = memoryutils.product;
        if(product._id){
            this.getCategoryId(product.categoryId)
        }
        

    }

    render() {
        const {categoryName} = this.state;
        //在渲染之前，先判断一下内存中有没有product
        const product = memoryutils.product;
        //{}转换成boolean值是true
        if(!product || !product._id){
            return <Redirect to='/product'/>
        }
        const title= (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' onClick={()=>{this.props.history.goBack()}}/>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='detail'>
                <List>
                    <Item>
                        <span className='detail-left'>商品名称:</span>
                        <span>{product.name}</span>
                    </Item>
                    <Item>
                        <span className='detail-left'>商品描述:</span>
                        <span>{product.desc}</span>
                    </Item>
                    <Item>
                        <span className='detail-left'>商品价格:</span>
                        <span>{product.price}</span>
                    </Item>
                    <Item>
                        <span className='detail-left'>商品分类:</span>
                        <span>{categoryName}</span>
                    </Item>
                    <Item>
                        <span className='detail-left'>商品图片:</span>
                        <span>
                            {
                                product.imgs.map((item)=><img className='detail-img' key={item} src={BASE_IMG + item} alt='图片'/>)
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className='detail-left'>商品详情:</span>
                        <div dangerouslySetInnerHTML={{__html:product.detail}}></div>
                    </Item>
                </List>
            </Card>
        )
    }
}
