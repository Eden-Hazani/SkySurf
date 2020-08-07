import React, { Component } from 'react';
import './layout.css'
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import { Home } from '../home/home';
import {Login} from '../login/login'
import { Register } from '../register/register';
import { Menu } from '../menu/menu';
import { AdminSpace } from '../admin-space/admin-space';
import { PageNotFound } from '../page-not-found/page-not-found';
import { Typography, Grid } from '@material-ui/core';
import { UsersModel } from '../../models/users-model';
import axios from 'axios';
import {Config} from '../../config'
import { AdminChart } from '../admin-chart/admin-chart';
import { About } from '../about/about';
import { Account } from '../account/account';



axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = "Bearer " + sessionStorage.getItem("token") ;
axios.defaults.headers.common['userLogged'] =  JSON.parse(sessionStorage.getItem("user"))?.uuid;
axios.defaults.headers.common['admin'] =  JSON.parse(sessionStorage.getItem("user"))?.isAdmin;


interface LayOutState{
    showMenu:boolean
}


export class Layout extends Component<any,LayOutState>{
    constructor(props:any){
        super(props)
        this.state={
            showMenu:true
        }
    }
    private userLogged = ()=>{
        return sessionStorage.getItem("token") !== null;
    }


    public setUserInfo=()=>{
        const user = sessionStorage.getItem("user")
        const userInfo = JSON.parse(user);
        return userInfo
    }

    public disableMenu=()=>{
        this.setState({showMenu:false})
    }

    public enableMenu=()=>{
        this.setState({showMenu:true})
    }
    componentDidMount(){
        document.title = "Sky Surfer"
    }



    render(){
        return(
            <Grid container
            direction="column"
            alignItems="center"
            style={{ minHeight: '100vh'}}>
                <BrowserRouter>
                {this.state.showMenu && 
                            <Grid container alignItems="flex-start"  direction="column">
                            <aside>
                                <Menu setUserInfo={this.setUserInfo}/>
                            </aside>
                        </Grid>}
                    <header className='header'>
                        <Grid container alignItems="center"  direction="column"  style={{ minHeight: '20vh' }}>
                            <Typography component="h1" variant="h2">
                                SkySurf
                            </Typography>
                            <Grid container item lg={12}  justify="center" alignItems="center">
                                <Typography component="h1" variant="h6" >
                                    - Your Indulgent vacation is only -
                                </Typography>
                            </Grid>
                            <Grid container item lg={12} justify="center" alignItems="center">
                                <Typography component="h1" variant="h6" >
                                    - A Few Clicks Away -
                                </Typography>
                            </Grid>
                        </Grid>
                    </header>
                        <Grid container >
                            <Switch>
                                <Route path='/home' render={props=><Home {...props} setUserInfo={this.setUserInfo} isUserLogged ={this.userLogged} enableMenu={this.enableMenu}/>}exact/>
                                <Route path='/about' render={props=><About {...props} isUserLogged ={this.userLogged} enableMenu={this.enableMenu}/>}exact/>
                                <Route path='/register' render={props=><Register {...props} enableMenu={this.disableMenu}/>}/>
                                <Route path='/login' render={props=><Login {...props} enableMenu={this.disableMenu}/>}/>
                                <Route path='/account' render={props=><Account {...props} setUserInfo={this.setUserInfo} isUserLogged ={this.userLogged}/>}/>
                                <Route path='/adminSpace' render={props=><AdminSpace {...props} setUserInfo={this.setUserInfo} isUserLogged ={this.userLogged}/>}/>
                                <Route path='/adminChart' render={props=><AdminChart {...props} setUserInfo={this.setUserInfo} isUserLogged ={this.userLogged}/>}/>
                                <Redirect from='/' to='/register' exact/>
                                <Route component={PageNotFound} /> 
                            </Switch>
                        </Grid>
                    <footer>

                    </footer>
                </BrowserRouter>
            </Grid>
        )
    }
}