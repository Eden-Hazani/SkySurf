import React, { Component } from 'react';
import './page-not-found.css'
import {Link} from 'react-router-dom';
import { Grid, Typography, Button, Box } from '@material-ui/core';


export class PageNotFound extends Component{
    render(){
        return(
            <Grid container
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '90vh' }}>
                <Typography component='h1' variant="h3" style={{color:'white',textShadow: '1px 2px 1px black'}}>
                    Oops... It seems Like you reached Somewhere no plane can Go :(
                </Typography>
                <Box m={10}>
                    <Grid container justify = "center" >
                        <Button color='default' to="/register" component={Link} size={"large"}>
                            Already A user? - Click Here To LogIn!
                        </Button>
                    </Grid>
                </Box>
                   
            </Grid>
        )
    }
}