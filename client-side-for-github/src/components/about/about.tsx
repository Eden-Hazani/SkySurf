import React, { Component } from 'react';
import './about.css';
import { Grid, Typography, Box } from '@material-ui/core';
import { UsersModel } from '../../models/users-model';
import { Redirect } from 'react-router-dom';
import { Config } from '../../config';
import axios from 'axios';
import Swal from 'sweetalert2';


interface AboutState{
    logged:boolean
    enableText:boolean
}

export class About extends Component<any,AboutState>{
    constructor(props:any){
        super(props)
        this.state={
            enableText:false,
            logged:false
        }
    }

    async componentDidMount(){
        document.body.style.backgroundImage = "url('/assets/resort1.jpg')"
        this.isConnected();
        setTimeout(() => {
            this.setState({enableText:true})
        }, 2000);
        const logged = await this.props.isUserLogged();
        this.setState({logged})
    }
    componentWillUnmount(){
        document.body.style.backgroundImage  = "linear-gradient(0deg, rgba(216, 95, 166, 0.308), rgba(255, 189, 103, 0.466)), url('/assets/login-wallpaper.jpg')"
    }

    private isConnected=async()=>{
        try{
            const url = Config.serverUrl;
            const response = await axios.get(`${url}/api/validator/isUserLogged`);
            return response.data
        }catch(err){
            if(err){
                if(err.response.status === 403){
                    Swal.fire({
                        title: 'Disconnected!',
                        text: `Session has expired, please login again`,
                        icon: 'error',
                        confirmButtonText: 'O.K'
                      })
                      this.props.history.push('/login');
                }else{
                    console.log(err.message)
                }
            }
        }
    }

    render(){
        return(
            this.state.enableText ? this.state.logged === false ? <Redirect to='/'/> :
            <Grid container alignItems="center" justify="center" direction="column">
                <Typography  style={{textAlign:'center'}}  variant='h3' component='h3'>Welcome To SkySurf</Typography>
                <Box mt={4}>
                    <Grid container alignItems="center" justify="center" direction="row" className='aboutInfo'>
                        <Grid container item xs={8} justify="center" alignItems="center">
                            <Typography style={{textAlign:'center'}} variant='h5'>With over 20 years of experience in the world of luxury travel,
                            We take pride in delivering the best experiences the world has to offer</Typography>    
                        </Grid>
                    </Grid>
                </Box>
            </Grid> : <div className='loadingGif'></div>

        )
    }
}