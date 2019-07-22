import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import PropTypes from 'prop-types'
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }
    state = {
        editorState: EditorState.createEmpty(),//编辑器的状态
    }
    uploadImageCallBack = (file) => {
        return new Promise(//执行器函数，在内部执行异步代码
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');//图片文件上传的路径
                xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
                const data = new FormData();
                data.append('image', file);//image 图片文件上传时的参数名
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    /* response 
                     {
                        "status": 0,
                        "data": {
                            "name": "image-1559466841118.jpg",
                            "url": "http://localhost:5000/upload/image-1559466841118.jpg"
                        }
                    }
                    */
                    const response = JSON.parse(xhr.responseText);//url和link都可以找到
                    const url = response.data.url
                    delete response.data.url
                    // response.data.url2 = url
                    response.data.link = url
                    resolve(response);
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    componentWillMount() {
        const detail = this.props.detail
        if (detail) {
            //根据detail生成editorState
            const contentBlock = htmlToDraft(detail);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            //更新状态
            this.setState({
                editorState
            })
        }
    }
    onEditorStateChange = (editorState) => {//当编辑器状态发生改变时触发的回调
        console.log('-----')
        this.setState({
            editorState,
        });
    };

    //获取detail的方法
    getDetail = () => draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    render() {
        //   console.log(this.getDetail())
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorStyle={{ height: 200, border: '1px solid #000', paddingLeft: 10 }}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />
                {/*  <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
            </div>
        );
    }
}