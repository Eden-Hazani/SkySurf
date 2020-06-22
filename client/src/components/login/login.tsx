import React, { Component, ChangeEvent } from 'react';
import { UsersModel } from '../../models/users-model';
import {Link} from 'react-router-dom';
import { Typography, Grid, TextField, Box, Button } from '@material-ui/core';
import './login.css';
import Swal from 'sweetalert2'
import axios from 'axios';

interface LoginState{
    users: UsersModel
}

export class Login extends Component<any,LoginState>{
    constructor(props:any){
        super(props)
        this.state={
            users: new UsersModel()
        }
    }

    public setUserName=(args:ChangeEvent<HTMLInputElement>)=>{
        const name = args.target.value;
        const users = {...this.state.users};
        users.userName = name;
        this.setState({users});
    }
    public setPassWord=(args:ChangeEvent<HTMLInputElement>)=>{
        const pass = args.target.value;
        const users = {...this.state.users};
        users.passWord = pass;
        this.setState({users})
    }
    public logIn = async()=>{
        try{
        const url = 'http://localhost:3000/api';
        const response = await axios.post<UsersModel>(`${url}/login`,this.state.users);
        const userData = response.data;
        Swal.fire({
            title: 'Success!',
            text: `Welcome ${userData.userName} Press Below To enter the site!`,
            icon: 'success',
            confirmButtonText: 'O.K'
          })
        this.props.history.push('/home');
        }catch(err){
            if(err.response.status === 401){
                Swal.fire({
                    title: 'Error!',
                    text: `Wrong Username Or Password`,
                    icon: 'error',
                    confirmButtonText: 'O.K'
                  })
                  return;
            }
        }
    }


    
    render(){
        return(
            <Grid container direction="column"  alignItems="center" justify="center" style={{ minHeight: '85vh' }}>
                <Box m={2}>
                    <Typography component="h1" variant="h4">Login!</Typography>
                </Box>
                <form className='logInForm' onSubmit={e => (e.preventDefault(), this.logIn())}>
                    <Grid container direction="row" spacing={5}>
                        <Grid item xs={12} sm={6}>
                            <TextField onChange={this.setUserName}
                                autoComplete="userName"
                                value={this.state.users.userName || ''}
                                error={this.state.users.userName === ""}
                                helperText={this.state.users.userName === "" ? 'Empty field!' : ' '}
                                name="firstName"
                                variant="outlined"
                                fullWidth
                                id="userName"
                                label="User Name"
                                autoFocus
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField onChange={this.setPassWord}
                                autoComplete="passWord"
                                value={this.state.users.passWord || ''}
                                error={this.state.users.passWord === ""}
                                helperText={ this.state.users.passWord === '' ?  'Empty field!' : ' '}
                                name="passWord"
                                variant="outlined"
                                fullWidth
                                id="passWord"
                                label="Password"
                                required
                            />
                        </Grid>
                        <Grid container justify = "center">
                            <Button variant="contained" color="primary" type='submit'>Log In!</Button>
                        </Grid>
                     </Grid>
                </form>
                <Box m={10}>
                    <Grid container justify = "center" >
                        <Button color='default' to="/register" component={Link} size={"large"} style={{border:'1px solid black'}}>
                            New To Our Site? Press here to join and find your destination today!
                        </Button>
                    </Grid>
                </Box>
            </Grid>
        )
    }
}