import React, { Component, ChangeEvent } from 'react';
import {Link} from 'react-router-dom';
import './register.css'
import { Typography, Grid, TextField, Box, Button } from '@material-ui/core';
import { UsersModel } from '../../models/users-model';
import Swal from 'sweetalert2'
import axios from 'axios';
import {Config} from '../../config'




interface RegisterState{
    users: UsersModel;
    checkPassword:string;
    errors:{usernameError:string,passwordError:string,firstNameError:string,lastNameError:string,checkedPassError:string}
}

export class Register extends Component<any,RegisterState>{
    constructor(props:any){
        super(props)
        this.state={
            users: new UsersModel(),
            errors:{usernameError:'*',passwordError:'*',firstNameError:'*',lastNameError:'*',checkedPassError:'*'},
            checkPassword:''
        }
    }

    componentDidMount(){
        this.props.enableMenu();
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
        if( /[^a-zA-Z0-9\-\/]/.test( name )){
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
        if(/[^a-zA-Z0-9\-\/]/.test( pass )){
            passwordError = '*'
        }
        errors.passwordError = passwordError;
        users.passWord = pass;
        this.setState({users,errors});
    }
    public setCheckPassWord = (args:ChangeEvent<HTMLInputElement>) =>{
        const pass = args.target.value;
        let passwordError = '';
        const errors = {...this.state.errors};
        if(pass !== this.state.users.passWord){
            passwordError = '*'
        }
        errors.checkedPassError = passwordError;
        this.setState({errors,checkPassword:pass});
    }

    public setFirstName =(args:ChangeEvent<HTMLInputElement>)=>{
        const firstName = args.target.value;
        let firstNameError = '';
        const users={...this.state.users}
        const errors ={...this.state.errors}
        if(firstName === ''){
            firstNameError = '*'
        }
        if(/[^a-zA-Z0-9\-\/]/.test(firstName)){
            firstNameError = '*'
        }
        if(/\d/.test(firstName)){
            firstNameError = '*'
        }
        errors.firstNameError = firstNameError;
        users.firstName = firstName;
        this.setState({users,errors})
    }
    public setLastName =(args:ChangeEvent<HTMLInputElement>)=>{
        const lastName = args.target.value;
        let lastNameError = '';
        const users={...this.state.users}
        const errors ={...this.state.errors}
        if(lastName === ''){
            lastNameError = '*'
        }
        if(/[^a-zA-Z0-9\-\/]/.test(lastName)){
            lastNameError = '*'
        }
        if(/\d/.test(lastName)){
            lastNameError = '*'
        }
        errors.lastNameError = lastNameError;
        users.lastName = lastName;
        this.setState({users,errors})
    }

    public isLegal = ()=>{
        return this.state.errors.usernameError === ''
        && this.state.errors.passwordError === ''
        && this.state.errors.lastNameError === ''
        && this.state.errors.firstNameError === ''
        && this.state.errors.checkedPassError==='';
    }

    public turnFirstNameToCaps(){
        const users = {...this.state.users};
        const name = users.firstName[0].toUpperCase() + users.firstName.slice(1);
        users.firstName = name;
        this.setState({users})
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
        this.turnFirstNameToCaps()
        const url = Config.serverUrl;
        const response = await axios.post(`${url}/api/register`,this.state.users);
        const userData = response.data;
        Swal.fire({
            title: 'Success!',
            text: `Welcome ${userData.user.userName} Press Below To enter the site!`,
            icon: 'success',
            confirmButtonText: 'O.K'
          })
        sessionStorage.setItem("user", JSON.stringify(userData.user));
        sessionStorage.setItem("token", userData.token);
        axios.defaults.headers.common['Authorization'] = "Bearer " + sessionStorage.getItem("token") ;
        axios.defaults.headers.common['userLogged'] =  JSON.parse(sessionStorage.getItem("user"))?.uuid;
        axios.defaults.headers.common['admin'] =  JSON.parse(sessionStorage.getItem("user"))?.isAdmin;
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
        <Grid container>
            <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '60vh',zIndex:10}}
            >
                <Box m={2}>
                    <Typography component="h1" variant="h4">
                            Sign Up!
                        </Typography>
                </Box>
                <form className='signUpForm' onSubmit={e => (e.preventDefault(), this.signUp())}>
                    <Grid container direction="row" spacing={5}>
                        <Grid item xs={12} sm={4}>
                            <TextField onChange={this.setUserName}
                                autoComplete="username"
                                value={this.state.users.userName || ''}
                                error={this.state.users.userName?.length < 3 || /[^a-zA-Z0-9\-\/]/.test( this.state.users.userName )}
                                helperText={[this.state.users.userName === "" ? 'Empty field!' : ' ' ,
                                this.state.users.userName?.length < 3 && this.state.users.userName?.length>0 ? 'Username cannot be under 3 characters': ' '
                                ,/[^a-zA-Z0-9\-\/]/.test( this.state.users.userName )?" Can't Use special characters": ' ']}
                                name="firstName"
                                variant="outlined"
                                fullWidth
                                id="userName"
                                label="User Name"
                                autoFocus
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField onChange={this.setPassWord}
                                autoComplete="new-password"
                                value={this.state.users.passWord || ''}
                                error={(this.state.users.userName === this.state.users.passWord && this.state.users.passWord?.length >0)
                                || this.state.users.passWord === '' || this.state.users.passWord?.length<5 || /[^a-zA-Z0-9\-\/]/.test( this.state.users.passWord )}
                                helperText={[this.state.users.userName === this.state.users.passWord && this.state.users.passWord?.length>0 ? ' Username cannot be the same as password!' : '',
                                this.state.users.passWord === '' ?  ' Empty field!' : ' ', this.state.users.passWord?.length<5? ' Password must be above 5 characters':'',
                                /[^a-zA-Z0-9\-\/]/.test( this.state.users.passWord )?" Can't Use special characters":' ']}
                                name="passWord"
                                variant="outlined"
                                fullWidth
                                id="passWord"
                                type="password"
                                label="Password"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField onChange={this.setCheckPassWord}
                                autoComplete="new-password"
                                value={this.state.checkPassword || ''}
                                error={this.state.users.passWord !== this.state.checkPassword && this.state.checkPassword.length>0}
                                helperText={this.state.users.passWord !== this.state.checkPassword  && this.state.checkPassword.length>0? "Passwords don't match!":''}
                                variant="outlined"
                                fullWidth
                                type="password"
                                label="Confirm Password"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField onChange={this.setFirstName}
                                autoComplete="firstName"
                                value={this.state.users.firstName || ''}
                                error={this.state.users.firstName === '' || /[^a-zA-Z0-9\-\/]/.test( this.state.users.firstName) 
                                || /\d/.test(this.state.users.firstName)}
                                helperText={[this.state.users.firstName === '' ?  ' Empty field!' : ' ',/[^a-zA-Z0-9\-\/]/.test( this.state.users.firstName)?" Can't Use special characters":' '
                                ,/\d/.test(this.state.users.firstName)? ' Cannot contain Numbers':' ']}
                                name="firstName"
                                variant="outlined"
                                fullWidth
                                id="firstName"
                                label="First Name"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField onChange={this.setLastName}
                                autoComplete="lastName"
                                value={this.state.users.lastName || ''}
                                error={this.state.users.lastName === '' || /[^a-zA-Z0-9\-\/]/.test( this.state.users.lastName) 
                                || /\d/.test(this.state.users.lastName)}
                                helperText={[this.state.users.lastName === '' ?  'Empty field!' : ' ',/[^a-zA-Z0-9\-\/]/.test( this.state.users.lastName)?" Can't Use special characters":' '
                                ,/\d/.test(this.state.users.lastName)? ' Cannot contain Numbers': ' ']}
                                name="lastName"
                                variant="outlined"
                                fullWidth
                                id="lastName"
                                label="Last Name"
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
                        <Button color='default' to="/login" component={Link} size={"large"} className='signupButt'>
                            Already A user? - Click Here To LogIn!
                        </Button>
                    </Grid>
                </Box>
                
                </Grid>   
        </Grid>
        )
    }
}