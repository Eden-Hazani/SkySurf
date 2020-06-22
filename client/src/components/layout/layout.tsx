import React, { Component } from 'react';
import './layout.css'
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import { Home } from '../home/home';
import {Login} from '../login/login'
import { Register } from '../register/register';
import { Menu } from '../menu/menu';
import { CreateVacation } from '../createVacation/createVacation';
import { PageNotFound } from '../page-not-found/page-not-found';
import { Typography, Grid } from '@material-ui/core';
import { UsersModel } from '../../models/users-model';
import axios from 'axios';


axios.defaults.withCredentials = true;



interface LayOutState{

}


export class Layout extends Component<any,LayOutState>{
    constructor(props:any){
        super(props)
        this.state={}
    }
    private userLogged = async()=>{
        try{
            const url = 'http://localhost:3000/api';
            const response = await axios.get<UsersModel>(`${url}/userLogged`);
            return response.data;
        }catch(err){
            if(err.response.status === 401){
                return false
            }
        }
    }



    render(){
        return(
            <Grid container
            direction="column"
            alignItems="center"
            style={{ minHeight: '100vh' }}>
                <BrowserRouter>
                    <header className='header'>
                        <Grid container alignItems="center"  direction="column"  style={{ minHeight: '20vh' }}>
                            <Typography component="h1" variant="h2">
                                SkySurf
                            </Typography>
                            <Typography component="h1" variant="h6" >
                                - Your Indulgent vacation is a few clicks away... -
                            </Typography>
                        </Grid>
                    </header>
                    <aside>
                        <Menu/>
                    </aside>
                    <main>
                        <Switch>
                            <Route path='/home' render={props=><Home {...props} isUserLogged ={this.userLogged}/>}exact/>
                            <Route path='/register' component={Register}/>
                            <Route path='/login' component={Login}/>
                            <Route path='/createVacation' component={CreateVacation}/>
                            <Redirect from='/' to='/register' exact/>
                            <Route component={PageNotFound} /> 
                        </Switch>
                    </main>
                    <footer>

                    </footer>
                </BrowserRouter>
            </Grid>
        )
    }
}