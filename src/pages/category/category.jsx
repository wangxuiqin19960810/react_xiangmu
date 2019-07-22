import React, { Component } from 'react'
import { Card, Button, Icon, Table, Modal, message } from 'antd';
import LinkButton from '../../components/link-button';
import { reqCategroys, reqCategroysAdd ,reqcategroysUpdate} from '../../api'
import AddUpdateForm from './add-update-form'

/**
 * 分类管理
 */




export default class Category extends Component {
  state = {
    categroys: [],//所有分类的数组
    loading: false,//是否正在加载中
    showStatus: 0 //0：不显示  1：添加分类  2：更新分类
  }

  //初始化table的列
  initColmuns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: '300px',
        //render将当前点击的行对应的数据对象给了我们
        render: (category) => <LinkButton onClick={() => {
          this.category = category // 保存当前分类, 其它地方都可以读取到
          this.setState({ showStatus: 2 })
        }}>修改分类</LinkButton>
      },
    ];
  }


  //发送获取分类列表的请求
  getreqCategroys = async () => {
    this.setState({ loading: true })
    const result = await reqCategroys();
    this.setState({ loading: false })
    if (result.status === 0) {
      const categroys = result.data
      //更新状态
      this.setState({
        categroys
      })
    } else {
      message.error('获取分类列表失败')
    }
  }





  //点击确定，添加/更新分类
  handleOk = () => {

    //统一验证表单
    this.form.validateFields(async (err, values) => {
      if (!err) {
        
        //获取输入信息
        const { categoryName } = values;
        console.log(categoryName)
        let result;
        const {showStatus} = this.state;
        if(showStatus === 1){
          //发送添加分类的请求
          
          result = await reqCategroysAdd(categoryName)
        }else{
          //发送更新分类的请求
          const categoryId = this.category._id;
          result = await reqcategroysUpdate({categoryId,categoryName})
        }
        
        this.form.resetFields()//重置输入的数据，变成初始值
        this.setState({ showStatus: 0 })
        let action = showStatus===1?'添加':'修改';
        if (result.status === 0) {
          //重新获取分类列表
          this.getreqCategroys();
          
          message.success(action + '分类成功')
        } else {
          message.error(action + '分类失败')
        }
      }
    });


  }
  //点击取消,隐藏模态框
  handleCancel = () => {
    this.form.resetFields()//重置输入的数据，变成初始值
    this.setState({
      showStatus: 0
    })
  }



  componentWillMount() {
    //初始化table的列
    this.initColmuns()

  }
  componentDidMount() {
    //发送获取分类列表的请求
    this.getreqCategroys();


  }
  render() {
    const extra = (
      <Button type='primary' onClick={() => { 
        this.category = {}
        this.setState({ showStatus: 1 }) 
        }}>
        <Icon type='plus'></Icon>
        <span>添加</span>
      </Button>
    )
    const { categroys, loading, showStatus } = this.state;
    //读取更新分类的名称
    const category = this.category || {}

    return (
      <Card extra={extra}>
        <Table
          columns={this.columns}
          dataSource={categroys}
          rowKey='_id'
          bordered//属性值为true时，可以省略
          pagination={{ defaultPageSize: 6, showQuickJumper: true }}
          loading={loading}
        />
        <Modal
          title={showStatus === 1 ? '添加分类' : '更新分类'}
          visible={showStatus !== 0}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {/* 将子组件的from通过setForm 属性传递父组件的实例对象 */}
          <AddUpdateForm setForm={form => this.form = form} categoryName={category.name}/>
        </Modal>
      </Card>
    )
  }
}
