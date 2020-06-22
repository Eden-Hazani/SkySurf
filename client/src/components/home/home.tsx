import React, { Component } from 'react';
import './home.css'
import { UsersModel } from '../../models/users-model';
import { VacationModel } from '../../models/vacation-model';
import { Grid, Box, Typography, Paper } from '@material-ui/core';
import axios from 'axios';
import { Redirect } from 'react-router-dom';



interface HomeState{
    userInfo: UsersModel
    vacations:VacationModel[]
    enableText:boolean
}
export class Home extends Component<any,HomeState>{
    constructor(props:any){
        super(props)
        this.state={
            userInfo: new UsersModel(),
            vacations:[],
            enableText:false
        }
    }


   async componentDidMount(){
       setTimeout(() => {
           this.setState({enableText:true})
       }, 2000);
        const userInfo = await this.props.isUserLogged();
        this.getVacations();
        this.setState({userInfo})
    }
    private getVacations =async()=>{
        try{
            const url = 'http://localhost:3000/api/vacations';
            const response = await axios.get<VacationModel[]>(`${url}/getVacations`);
            const vacations = response.data;
            this.setState({vacations})
        }catch(err){
            console.log(err.message)
        }
    }




    render(){
        return(
            this.state.userInfo === false ? <Redirect to='/'/> : !this.state.enableText ? null :
            <Grid container >
                <Box mb={2}>
                    <Grid container alignItems="flex-start" justify="flex-start" direction="row" >
                        <Typography component="h1" variant="h6">
                                Welcome - {`${this.state.userInfo.userName}`}
                        </Typography>
                    </Grid>
                </Box>
                    <Grid container alignItems="flex-start" justify="flex-start" direction="row"style={{ minHeight: '50vh'}}>
                        <Typography  component="h1" variant="h4">
                            Vacations You Follow!
                        </Typography>
                        <Grid container style={{  overflowX:'auto',minHeight: '40vh'}}>
                            {this.state.userInfo.followsVacations === "" ? <Box mt={4}><div>You Don't Seem to follow any Vacations yet, Feel free to pick some!</div></Box> :
                            this.state.userInfo.followsVacations.split(',').map(vacations=>this.state.vacations
                            .filter(fVacations=>fVacations.vacationId === +vacations)
                            .map(pickedVacations=>{
                                return <Grid  container xs={10} sm={4}   justify="center" className='vacationContainer'>
                                            <Paper className='vacationContainerBackground' 
                                            style={{background:` linear-gradient(0deg, rgba(216, 95, 166, 0.541), rgba(255, 189, 103, 0.438)), url("http://localhost:3000/uploads/${pickedVacations.vacationImg}")`}}>
                                                <Box ml={2}>
                                                    <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                                                        <Typography gutterBottom variant="subtitle1">{pickedVacations.destination}</Typography>
                                                    </Grid>
                                                </Box>
                                                <Grid container direction="row" justify="center" alignItems="center">
                                                    <Typography gutterBottom variant="subtitle1">{pickedVacations.description}</Typography>
                                                </Grid>
                                                <Grid container direction="row" justify="center" alignItems="center">
                                                    <Typography gutterBottom variant="subtitle1">Dates - {pickedVacations.vacationDates}</Typography>
                                                </Grid>
                                                <Grid container direction="row" justify="center" alignItems="flex-end" >
                                                    <Typography gutterBottom variant="subtitle1">Now for Just - {pickedVacations.price} $ per Person!</Typography>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                            }))
                            }
                        </Grid>
                       
                    </Grid>
            </Grid>
        )
    }
}
