import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd'
import throttle from 'lodash.throttle'
import LinkButton from '../../components/link-button'
import { reqProdocts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
import memoryutils from '../../utils/memoryutils'
/**
 * 商品管理
 */
const Option = Select.Option;
export default class ProductHome extends Component {
    state = {
        products: [],//商品列表
        loading: false,
        total: 0,//商品的总数量
        searchType: 'productName',//默认按商品名称搜索
        searchName: ''//搜索的关键字
    }
    //发送请求对商品进行上架/下架处理
    updateStatus = throttle(async (productId, status) => {

        //计算更新后的值
        status = status === 1 ? 2 : 1
        //请求更新
        const result = await reqUpdateStatus(productId, status);
        if (result.status === 0) {
            message.success('更新商品状态成功!')
            this.getProdocts(this.pageNum)

        }

    }, 5000)


    initcolumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc'
            },
            {
                title: '价格',
                dataIndex: 'price',
                //显示的数据不是数据本身的时候，就要写render，render的返回值就是可以显示的值
                render: (price) => '￥' + price
            },
            {
                title: '状态',
                width: '100px',
                // dataIndex: 'status',
                render: ({ _id, status }) => {
                    let btntext = '下架'
                    let text = '在售'
                    if (status === 2) {
                        btntext = '上架'
                        text = '已下架'
                    }
                    return (
                        <span>
                            <button onClick={() => { this.updateStatus(_id, status) }}>{btntext}</button><br />
                            <span>{text}</span>
                        </span>

                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: (product) => (
                    <span>
                        <LinkButton
                            onClick={() => {
                                //在内存中保存product
                                memoryutils.product = product;
                                this.props.history.push('/product/detail')
                            }}
                        >
                            详情
                        </LinkButton>
                        <LinkButton 
                            onClick={() => {
                                //在内存中保存product
                                memoryutils.product = product;
                                this.props.history.push('/product/addupdate')
                            }}
                        > 
                            修改
                        </LinkButton>
                    </span>
                )

            }
        ]
    }

    //异步获取指定页码商品（可能带搜索）分页列表显示
    getProdocts = async (pageNum) => {
        //保存当前请求的页码
        this.pageNum = pageNum;
        const { searchName, searchType } = this.state;
        let result;
        if (this.search) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {
            result = await reqProdocts(pageNum, PAGE_SIZE)
        }
        // this.search = false;
        // console.log(result)
        if (result.status === 0) {
            //取出数据
            const { total, list } = result.data
            //更新状态
            this.setState({
                products: list,
                total
            })
        }
    }

    //挂载之前初始化列
    componentWillMount() {
        this.initcolumns()
    }

    //
    componentDidMount() {
        //获取第一页显示
        this.getProdocts(1)
    }
    render() {
        const { loading, products, total, searchType, searchName } = this.state
        const title = (
            <span>
                <Select
                    style={{ width: 200 }}
                    value={searchType}
                    onChange={(value) => this.setState({ searchType: value })}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    type='text' placeholder='关键字'
                    style={{ width: 200, margin: '0 10px' }}
                    value={searchName}
                    onChange={(event) => {
                        this.setState({ searchName: event.target.value })
                    }}
                />
                <Button type='primary' onClick={
                    () => {
                        this.search = true
                        this.getProdocts(1)
                    }
                }
                >
                    搜索
                </Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={() => {
                memoryutils.product = {} //防止修改商品后，添加商品时还会有数据存在
                this.props.history.push('/product/addupdate')
            }}>
                <Icon type='plus'></Icon>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    columns={this.columns}
                    dataSource={products}
                    rowKey='_id'
                    bordered//属性值为true时，可以省略
                    loading={loading}
                    pagination={{
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProdocts,
                        current: this.pageNum
                    }}
                />

            </Card>
        )
    }
}
