import React,{Component} from 'react';
import {Route,Switch} from 'react-router-dom';
import Login from './pages/login/login';
import Admin from './pages/admin/admin';
export default class App extends Component{
    render(){
        return(
                // 注册一级路由 
                <Switch>
                    <Route path='/login' component={Login}/>
                    <Route path='/' component={Admin}/>
                </Switch>
        )
    }
}