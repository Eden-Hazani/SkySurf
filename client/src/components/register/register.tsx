import React, { Component, ChangeEvent } from 'react';
import {Link} from 'react-router-dom';
import './register.css'
import { Typography, Grid, TextField, Box, Button } from '@material-ui/core';
import { UsersModel } from '../../models/users-model';
import Swal from 'sweetalert2'
import axios from 'axios';


interface RegisterState{
    users: UsersModel;
    errors:{usernameError:string,passwordError:string}
}

export class Register extends Component<any,RegisterState>{
    constructor(props:any){
        super(props)
        this.state={
            users: new UsersModel(),
            errors:{usernameError:'*',passwordError:'*'}
        }
    }

    public setUserName =(args:ChangeEvent<HTMLInputElement>)=>{
        const name = args.target.value;
        let nameError = '';
        const users = {...this.state.users};
        const errors = {...this.state.errors};
        if(name === ''){
            nameError = '*';
        }
        if(name.length<3){
            nameError = '*';
        }
        users.userName = name;
        errors.usernameError = nameError;
        this.setState({users,errors});
    }


    public setPassWord = (args:ChangeEvent<HTMLInputElement>) =>{
        const pass = args.target.value;
        let passwordError = '';
        const users = {...this.state.users};
        const errors = {...this.state.errors};
        if(pass === ''){
            passwordError = '*'
        }
        if(pass === this.state.users.userName){
            passwordError = '*'
        }
        if(pass.length<5){
            passwordError = '*'
        }
        errors.passwordError = passwordError;
        users.passWord = pass;
        this.setState({users,errors});
    }

    public isLegal = ()=>{
        return this.state.errors.usernameError === ''
        && this.state.errors.passwordError === '';
    }

    public signUp = async()=>{
        try{
            if(!this.isLegal()){
                Swal.fire({
                    title: 'Error!',
                    text: 'Please fix the form Errors!',
                    icon: 'error',
                    confirmButtonText: 'O.K'
                  })
                  return;
            }
        const url = 'http://localhost:3000/api';
        const response = await axios.post<UsersModel>(`${url}/register`,this.state.users);
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
                    text: `Seems Like That Name is already taken :( 
                            Try Another One!`,
                    icon: 'error',
                    confirmButtonText: 'O.K'
                  })
                  return;
            }
        }

    }

    render(){
        return(
        <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '85vh' }}
          >
              <Box m={2}>
                <Typography component="h1" variant="h4">
                        Sign Up!
                    </Typography>
              </Box>
              <form className='signUpForm' onSubmit={e => (e.preventDefault(), this.signUp())}>
                <Grid container direction="row" spacing={5}>
                    <Grid item xs={12} sm={6}>
                        <TextField onChange={this.setUserName}
                            autoComplete="userName"
                            value={this.state.users.userName || ''}
                            error={this.state.users.userName?.length < 3}
                            helperText={[this.state.users.userName === "" ? 'Empty field!' : ' ' ,
                             this.state.users.userName?.length < 3 && this.state.users.userName?.length>0 ? 'Username cannot be under 3 characters': ' ']}
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
                            error={this.state.users.userName === this.state.users.passWord && this.state.users.passWord?.length >0
                             || this.state.users.passWord === '' || this.state.users.passWord?.length<5}
                            helperText={[this.state.users.userName === this.state.users.passWord && this.state.users.passWord?.length>0 ? 'Username cannot be the same as password!' : '',
                            this.state.users.passWord === '' ?  'Empty field!' : ' ',
                            this.state.users.passWord?.length<5? 'Password must be above 5 characters':'']}
                            name="passWord"
                            variant="outlined"
                            fullWidth
                            id="passWord"
                            label="Password"
                            required
                        />
                    </Grid>
                    <Grid container justify = "center">
                        <Button variant="contained" color="primary" type='submit' >Sign Up!</Button>
                    </Grid>
                </Grid>
              </form>
              <Box m={10}>
                <Grid container justify = "center" >
                    <Button color='default' to="/login" component={Link} size={"large"} style={{border:'1px solid black'}}>
                        Already A user? - Click Here To LogIn!
                    </Button>
                </Grid>
              </Box>
              
            </Grid>   

        )
    }
}