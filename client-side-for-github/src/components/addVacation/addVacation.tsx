import React, { Component, ChangeEvent } from 'react';
import './addVacation.css'
import { VacationModel } from '../../models/vacation-model';
import { UsersModel } from '../../models/users-model';
import { Grid, Typography, Paper, Box, TextField, Button, Input, Modal,} from '@material-ui/core';
import axios from 'axios';
import {Config} from '../../config'
import ReactCardFlip from 'react-card-flip';
import { Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';

interface AddVacationState{
    time:number
    showLoading:boolean
    newVacation: VacationModel
    errors:{startDateError:string,endDateError:string,descriptionError:string,destinationError:string,priceError:string}
}



export class AddVacation extends Component<any,AddVacationState>{
    constructor(props:any){
        super(props)
        this.state={
            time:5,
            showLoading:false,
            newVacation:new VacationModel(),
            errors:{startDateError:'*',endDateError:'*',descriptionError:'*',destinationError:'*',priceError:'*'}
        }
    }
    public setDestination=(args:ChangeEvent<HTMLInputElement>)=>{
        const destination = args.target.value;
        const newVacation = {...this.state.newVacation};
        newVacation.destination = destination;
        this.setState({newVacation},()=>{
            this.validateForm();
        });
    }
    public setDescription=(args:ChangeEvent<HTMLInputElement>)=>{
        const description = args.target.value;
        const newVacation = {...this.state.newVacation};
        newVacation.description = description;
        this.setState({newVacation},()=>{
            this.validateForm();
        });
    }
    public setStartDate=(args:ChangeEvent<HTMLInputElement>)=>{
        const startDate = args.target.value;
        const newVacation = {...this.state.newVacation};
        newVacation.startDate = startDate;
        this.setState({newVacation},()=>{
            this.validateForm();
        });
    }
    public setEndDate=(args:ChangeEvent<HTMLInputElement>)=>{
        const endDate = args.target.value;
        const newVacation = {...this.state.newVacation};
        newVacation.endDate = endDate;
        this.setState({newVacation},()=>{
            this.validateForm();
        });
    }
    public setPrice=(args:ChangeEvent<HTMLInputElement>)=>{
        const price = +args.target.value;
        const newVacation = {...this.state.newVacation};
        newVacation.price = price;
        this.setState({newVacation},()=>{
            this.validateForm();
        });
    }

    public validateForm=()=>{
        let errors = {...this.state.errors}
        errors.destinationError = ''
        errors.descriptionError = ''
        errors.startDateError = ''
        errors.endDateError = ''
        errors.priceError = ''
        if(this.state.newVacation.destination === undefined || this.state.newVacation.destination === ''){
            errors.destinationError = '*'
        }
        if(this.state.newVacation.destination?.length>20){
            errors.destinationError = '*'
        }
        if(this.state.newVacation.description === undefined || this.state.newVacation.description === ''){
            errors.descriptionError = '*'
        }
        if(this.state.newVacation.startDate === undefined || this.state.newVacation.startDate === ''){
            errors.startDateError = '*'
        }
        if(this.state.newVacation.startDate > this.state.newVacation.endDate){
            errors.startDateError = '*'
        }
        if(this.state.newVacation.endDate === undefined || this.state.newVacation.endDate === ''){
            errors.endDateError = '*'
        }
        if(this.state.newVacation.price === undefined || this.state.newVacation.price === null || this.state.newVacation.price === 0){
            errors.priceError = '*'
        }
        this.setState({errors})
        if(
            this.state.errors.descriptionError === ''
            && this.state.errors.destinationError === ''
            && this.state.errors.startDateError === ''
            && this.state.errors.endDateError === ''
            && this.state.errors.priceError === ''){
                return true
        }
        return false
    }
    public closeAfterSubmit = ()=>{
        this.setState({showLoading:true})
        this.setTimer();
        setTimeout(() => {
            this.props.closeModal()
            this.setState({showLoading:false,time:5})
        }, 5000);
    }   
    public setTimer = ()=>{
        setInterval(() => {
            let time = this.state.time;
            time = time - 1;
            this.setState({time})
        }, 1000)
    }

    public handleSubmit=async(event:any)=>{
        const isValid = this.validateForm();
        if(!isValid){
            Swal.fire({
                title: 'Error!',
                text: `Please Fix The Form`,
                icon: 'error',
                confirmButtonText: 'O.K'
              })
            event.preventDefault();
            return
        }else{
            this.closeAfterSubmit();
        }
    }
    render(){
        return(
            <Grid> 
                    <Grid container direction="row" justify="center" alignItems="center" >
                    <Paper className='modelWindow'>
                        <Grid container direction="column" justify="center" alignItems="center">
                            <Grid container direction="row" justify="center" alignItems="center">
                                    <Typography component='h1' variant='h5'>Add Vacation</Typography>
                            </Grid>
                        <Box ml={2}>
                                    <Grid container direction="row" justify="center" alignItems="center">
                                        <TextField onChange={this.setDestination}
                                            label="Destination"
                                            value={this.state.newVacation.destination || ''}
                                            name='destination'
                                            error={this.state.newVacation.destination === '' || this.state.newVacation.destination?.length>20}
                                            helperText={[this.state.newVacation.destination === '' || this.state.newVacation.destination === undefined ? 'Empty Field' : ''
                                            ,this.state.newVacation.destination?.length>20 ? 'Cannot be above 20 letters':'']} /> 
                                    </Grid>
                                </Box>
                                <Grid container direction="row" justify="center" alignItems="center" style={{height:'170px'}}>
                                    <TextField onChange={this.setDescription}
                                    label="Description"
                                    value={this.state.newVacation.description || ''}
                                    name='description'
                                    error={this.state.newVacation.description === '' }
                                    helperText={this.state.newVacation.description === '' || this.state.newVacation.description === undefined ? 'Empty Field' : ''}/>
                                </Grid>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <TextField onChange={this.setStartDate}
                                    value={this.state.newVacation.startDate || ''}                                              
                                    id="startDate"
                                    label="Start Date"
                                    type="date"
                                    InputLabelProps={{shrink: true,}}
                                    error={this.state.newVacation.startDate === '' 
                                    || this.state.newVacation.startDate > this.state.newVacation.endDate}
                                    helperText={this.state.newVacation.startDate === '' || this.state.newVacation.startDate === undefined ? 'Empty Field' : '' 
                                    || this.state.newVacation.startDate > this.state.newVacation.endDate ? 'Starting date cannot be bigger then ending date' : ''}/>
                                </Grid>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <TextField onChange={this.setEndDate}
                                    value={this.state.newVacation.endDate || ''}                                              
                                    id="endDate"
                                    label="End Date"
                                    type="date"
                                    InputLabelProps={{shrink: true,}}
                                    error={this.state.newVacation.endDate === ''
                                    || this.state.newVacation.startDate > this.state.newVacation.endDate}
                                    helperText={this.state.newVacation.endDate === '' || this.state.newVacation.endDate === undefined ? 'Empty Field' : '' 
                                    || this.state.newVacation.startDate > this.state.newVacation.endDate ? 'Starting date cannot be bigger then ending date' : ''}/>
                                </Grid>
                                <Grid container direction="row" justify="center" alignItems="flex-end" >
                                    <TextField onChange={this.setPrice}
                                    label="Price"
                                    value={this.state.newVacation.price || ''}  
                                    name='price'
                                    error={this.state.newVacation.price === 0 || this.state.newVacation.price === null}
                                    helperText={this.state.newVacation.price === 0 || this.state.newVacation.price === undefined ? 'Empty Field' : ''} />
                                </Grid>
                                <Grid container direction="row" justify="center" alignItems="flex-end">
                                <iframe name='formRedirect' title='formRedirect' style={{display:'none'}}></iframe>
                                    <form    
                                        target= 'formRedirect'
                                        method="post"
                                        action={`${Config.serverUrl}/api/vacations/addVacation`}
                                        encType="multipart/form-data">
                                        <input name='vacationId' style={{display:'none'}} />    
                                        <Box mt={2}>
                                            <Button variant="contained" color="secondary"><input  type="file" name="vacationImg"  accept="image/*"/>Upload Image</Button>
                                        </Box>                                        
                                        <input type='txt' name='description' defaultValue={this.state.newVacation.description || ''} style={{display:'none'}}/>
                                        <input type='txt' name='destination' defaultValue={this.state.newVacation.destination || ''} style={{display:'none'}}/>
                                        <input type='txt' name='startDate' defaultValue={this.state.newVacation.startDate || ''} style={{display:'none'}}/>
                                        <input type='txt' name='endDate' defaultValue={this.state.newVacation.endDate || ''} style={{display:'none'}}/>
                                        <input type='txt' name='price' defaultValue={this.state.newVacation.price || ''} style={{display:'none'}}/>
                                        <br/>
                                        <Grid container direction="row" justify="center" alignItems="flex-end">
                                            <Button type='submit' variant="contained" color="primary" onClick={(event)=>this.handleSubmit(event)}>
                                                        Submit Changes
                                            </Button>
                                        </Grid>
                                    </form>
                                    {this.state.showLoading ? 
                                    <Grid className='SubmitVacationLoad'>
                                        <div style={{width:250,height:250}} className='loadingGif'></div>
                                        <br/>
                                        <Typography variant='h4' style={{textAlign:'center'}}>Submitting...</Typography>
                                        <Typography variant='h5' style={{textAlign:'center'}}>Window will close in {this.state.time}</Typography>
                                    </Grid> : null}   
                                </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}