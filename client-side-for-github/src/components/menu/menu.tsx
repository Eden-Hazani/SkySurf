import React, { Component } from 'react';
import './menu.css'
import { UsersModel } from '../../models/users-model';
import { NavLink, Redirect } from 'react-router-dom';
import { bubble as BurgerMenu } from 'react-burger-menu'
import { Config } from '../../config';
import axios from 'axios';
import { Button } from '@material-ui/core';

interface MenuState{
    isAdmin:boolean
    menuOpen:boolean
    userInfo:UsersModel
    redirect:boolean
}

export class Menu extends Component<any,MenuState>{
    constructor(props:any){
        super(props)
        this.state = {
            isAdmin:false,
            menuOpen:false,
            userInfo: new UsersModel(),
            redirect:false
        }
    }
    async componentDidMount(){
        const userInfo = await this.props.setUserInfo();
        this.setState({userInfo});
         const admin = await this.isAdmin();
         !admin ? this.setState({isAdmin:false}):this.setState({isAdmin:true})
    }
    closeMenuOnClick = ()=>{
        this.setState({menuOpen:false})
    }
    async handleStateChange (state:any) {
        this.setState({menuOpen: state.isOpen})  
    }

    private logOut =()=>{
        sessionStorage.clear();
        delete axios.defaults.headers.common["Authorization"];
        delete axios.defaults.headers.common['userLogged'];
        delete axios.defaults.headers.common['admin'];
        this.setState({redirect:true})
    }

    private isAdmin=async()=>{
        try{
            const url = Config.serverUrl;
            const response = await axios.get(`${url}/api/validator/isUserAdmin/${this.state.userInfo.isAdmin}`);
            return response.data
        }catch(err){

        }
    }

    render(){
        return(
            this.state.redirect ? <Redirect to='/login'/>:
            <div className='menu'>
                  <BurgerMenu id='bubble' overlayClassName={ "menuOverlay" } isOpen={this.state.menuOpen} onStateChange={(state)=> this.handleStateChange(state)}>
                    <NavLink to='/home' exact onClick={()=>this.closeMenuOnClick()}>
                        <div className='menuFlex'>
                            <span>Home</span>
                        </div>
                    </NavLink>
                    <NavLink to='/about' exact onClick={()=>this.closeMenuOnClick()}>
                        <div className='menuFlex'>
                            <span>About Us</span>
                        </div>
                    </NavLink>
                    {this.state.isAdmin ? 
                            <NavLink to='/adminSpace' exact onClick={()=>this.closeMenuOnClick()}>
                               <div className='menuFlex'>
                                   <span>Admin Space</span>
                               </div>
                           </NavLink>
                    : null}
                    {this.state.isAdmin ? 
                        <NavLink to='/adminChart' exact onClick={()=>this.closeMenuOnClick()}>
                            <div className='menuFlex'>
                                <span>Admin Chart</span>
                            </div>
                        </NavLink>
                    :null}
                       <NavLink to='/account' exact onClick={()=>this.closeMenuOnClick()}>
                            <div className='menuFlex'>
                                <span>Account</span>
                            </div>
                        </NavLink>
                    <button onClick={()=>{this.logOut()}} className='bm-item logoutButt'>
                        <div className='menuFlex'>
                            <span>Logout</span>
                        </div>
                    </button>
                </BurgerMenu>
            </div>
        )
    }
}