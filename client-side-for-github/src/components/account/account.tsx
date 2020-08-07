import React, { Component, ChangeEvent } from 'react';
import './account.css'
import { Grid, Typography, Box, TextField, Button, Paper } from '@material-ui/core';
import { UsersModel } from '../../models/users-model';
import { Redirect } from 'react-router-dom';
import { Config } from '../../config';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactCardFlip from 'react-card-flip';


interface AccountState{
    confirmPassword:string;
    isFlipped:boolean;
    checkPassword:string;
    userInfo:UsersModel
    logged:boolean
    enableText:boolean
    newUserInfo:UsersModel
    errors:{usernameError:string,passwordError:string,checkedPassError:string}
}

export class Account extends Component<any,AccountState>{
    constructor(props:any){
        super(props)
        this.state={
            errors:{usernameError:'*',passwordError:"*",checkedPassError:"*"},
            checkPassword:'',
            isFlipped:false,
            userInfo:new UsersModel(),
            logged:false,
            enableText:false,
            newUserInfo:new UsersModel(),
            confirmPassword:''
        }
    }

    async componentWillMount(){
        const logged = await this.props.isUserLogged();
        const userInfo = await this.props.setUserInfo();
        this.setState({logged,userInfo},()=>
        {
            if(this.state.userInfo !== null){
                this.setState({newUserInfo:{uuid:this.state.userInfo.uuid}})
            }
        });
    }
    async componentDidMount(){
        setTimeout(() => {
            this.setState({enableText:true})
        }, 2000);
    }

    public confirmUser=async()=>{
        try{
            const url = Config.serverUrl;
            const userDetails = {
                userName:this.state.userInfo.userName,
                password:this.state.confirmPassword
            }
            const response = await axios.post(`${url}/api/checkPass`,userDetails);
            if(response.data === true){
                this.setState({isFlipped:true})
                return
            }
            if(!response.data){
                Swal.fire({
                    title: 'Error!',
                    text: 'Wrong Password!',
                    icon: 'error',
                    confirmButtonText: 'O.K'
                  })
            }
        }catch(err){
            console.log(err.message)
        }
    }

    public updateUserInfo=async()=>{
        try{
            if(!this.isLegal()){
                Swal.fire({
                    title: 'Error!',
                    text: 'Please Fix The Errors On The Form!',
                    icon: 'error',
                    confirmButtonText: 'O.K'
                  })
                  return;
            }
            const url = Config.serverUrl;
            await axios.patch(`${url}/api/userDetails/${this.state.userInfo.uuid}`,this.state.newUserInfo);
            this.changeUserState();
        }catch(err){

        }
    }

  

    public changeUserState=()=>{
        let userInfo = {...this.state.userInfo};
        userInfo.userName = this.state.newUserInfo.userName;
        this.setState({userInfo},()=>{
            sessionStorage.setItem("user",JSON.stringify(this.state.userInfo))
            Swal.fire({
                title: 'Info Has Been Updated',
                text: 'Your Information has been updated, page will now reload.',
                icon: 'success',
                timer: 2000,
                showCancelButton: false,
                showConfirmButton: false
              }).then(
                  function (){window.location.reload(false)}
              )
        })
    }

    public setUserName =(args:ChangeEvent<HTMLInputElement>)=>{
        const name = args.target.value;
        let nameError = '';
        const newUserInfo = {...this.state.newUserInfo};
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
        newUserInfo.userName = name;
        errors.usernameError = nameError;
        this.setState({newUserInfo,errors});
    }

    public setPassWord = (args:ChangeEvent<HTMLInputElement>) =>{
        const pass = args.target.value;
        let passwordError = '';
        const newUserInfo = {...this.state.newUserInfo};
        const errors = {...this.state.errors};
        if(pass === ''){
            passwordError = '*'
        }
        if(pass === this.state.newUserInfo.userName){
            passwordError = '*'
        }
        if(pass.length<5){
            passwordError = '*'
        }
        if(/[^a-zA-Z0-9\-\/]/.test( pass )){
            passwordError = '*'
        }
        errors.passwordError = passwordError;
        newUserInfo.passWord = pass;
        this.setState({newUserInfo,errors});
    }
    public setCheckPassWord = (args:ChangeEvent<HTMLInputElement>) =>{
        const pass = args.target.value;
        let passwordError = '';
        const errors = {...this.state.errors};
        if(pass !== this.state.newUserInfo.passWord){
            passwordError = '*'
        }
        errors.checkedPassError = passwordError;
        this.setState({errors,checkPassword:pass});
    }

    public setConfirmPassword =(args:ChangeEvent<HTMLInputElement>)=>{
        const pass = args.target.value;
        this.setState({confirmPassword:pass})
    }

    public isLegal = ()=>{
        return this.state.errors.usernameError === ''
        && this.state.errors.passwordError === ''
        && this.state.errors.checkedPassError==='';
    }



    render(){
        return(
            this.state.enableText ? this.state.logged === false  ? <Redirect to='/'/> :
            <Grid container>
                <Grid container alignItems="center"  direction="column">
                    <Box mb={10}>
                        <Typography className='accSettings' component="h1" variant="h2">Account Settings</Typography>
                    </Box>
                </Grid>
                <Grid container justify="center">
                    <Grid container justify="center">
                        <Typography component="h1" variant="h6" style={{textShadow:'1px 1px white',color:'black'}}>Change credentials</Typography>
                    </Grid>
                    <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="horizontal" >
                        <Grid  className='changeCredentialsBackground'>
                            <Grid container direction='row' justify="center" alignItems="center">
                                <Box mt={2}>
                                    <Typography component="h1" variant="h6" style={{textShadow:'1px 1px white',color:'black'}}>Enter your current password</Typography>
                                </Box>
                            </Grid>
                            <Grid container direction='row' item xs={12}  justify="center" alignItems="center">
                                <Box m={2}>
                                    <TextField onChange={this.setConfirmPassword}
                                    label='Password'
                                    required
                                    value={this.state.confirmPassword}
                                    />
                                </Box>
                            </Grid>
                            <Grid container direction='row'  justify="center" alignItems="center">
                                <Box mt={8} style={{border:'1px solid black',borderRadius:'25px'}}>
                                    <Button onClick={()=>{this.confirmUser()}}>Confirm</Button>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid  className='changeCredentialsBackground'>
                            <Grid container direction='row' item xs={12}  justify="center" alignItems="center">
                                <form onSubmit={e => (e.preventDefault(), this.updateUserInfo())}>
                                <Grid container direction='row' item xs={12}  justify="center" alignItems="center">
                                    <Box m={2}>
                                        <TextField onChange={this.setUserName}
                                        label='User Name'
                                        required
                                        value={this.state.newUserInfo.userName || ''}
                                        error={this.state.newUserInfo.userName?.length < 3 || /[^a-zA-Z0-9\-\/]/.test( this.state.newUserInfo.userName )}
                                        helperText={[this.state.newUserInfo.userName === "" ? 'Empty field!' : ' ' ,
                                        this.state.newUserInfo.userName?.length < 3 && this.state.newUserInfo.userName?.length>0 ? 'Username cannot be under 3 characters': ' '
                                        ,/[^a-zA-Z0-9\-\/]/.test( this.state.newUserInfo.userName )?" Can't Use special characters": ' ']}/>
                                    </Box>
                                    <Box m={2}>
                                        <TextField onChange={this.setPassWord}
                                        label='Password'
                                        required
                                        value={this.state.newUserInfo.passWord || ''}
                                        error={(this.state.newUserInfo.userName === this.state.newUserInfo.passWord && this.state.newUserInfo.passWord?.length >0)
                                        || this.state.newUserInfo.passWord === '' || this.state.newUserInfo.passWord?.length<5 || /[^a-zA-Z0-9\-\/]/.test( this.state.newUserInfo.passWord )}
                                        helperText={[this.state.newUserInfo.userName === this.state.newUserInfo.passWord && this.state.newUserInfo.passWord?.length>0 ? ' Username cannot be the same as password!' : '',
                                        this.state.newUserInfo.passWord === '' ?  ' Empty field!' : ' ', this.state.newUserInfo.passWord?.length<5? ' Password must be above 5 characters':'',
                                        /[^a-zA-Z0-9\-\/]/.test( this.state.newUserInfo.passWord )?" Can't Use special characters":' ']}/>
                                    </Box>
                                    <Box m={2}>
                                        <TextField onChange={this.setCheckPassWord}
                                        label='Confirm Password'
                                        required
                                        value={this.state.checkPassword || ''}
                                        error={this.state.newUserInfo.passWord !== this.state.checkPassword && this.state.checkPassword.length>0}
                                        helperText={this.state.newUserInfo.passWord !== this.state.checkPassword  && this.state.checkPassword.length>0? "Passwords don't match!":''}/>
                                    </Box>
                                </Grid>
                                    <Grid container justify = "center">
                                        <Box mt={5}>
                                            <Button variant="contained" color="primary" type='submit' style={{margin:'5px'}}>Change Now!</Button>
                                            <Button variant="contained" color="secondary" onClick={()=>{this.setState({confirmPassword:'',isFlipped:false})}} style={{margin:'5px'}}>Cancel</Button>
                                        </Box>
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>
                    </ReactCardFlip>
                </Grid>
            </Grid>
        : <div className='loadingGif'></div>)
    }
}