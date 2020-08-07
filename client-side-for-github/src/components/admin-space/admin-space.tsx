import React, { Component, ChangeEvent } from 'react';
import './admin-space.css'
import { VacationModel } from '../../models/vacation-model';
import { UsersModel } from '../../models/users-model';
import { Grid, Typography, Paper, Box, TextField, Button, Modal,} from '@material-ui/core';
import axios from 'axios';
import {Config} from '../../config'
import ReactCardFlip from 'react-card-flip';
import { Redirect } from 'react-router-dom';
import socketIOClient  from "socket.io-client";
import { AddVacation } from '../addVacation/addVacation';
const socket = socketIOClient(Config.serverUrl);





interface AdminSpaceState{
    adminInfo: UsersModel
    isAdmin:boolean
    logged:boolean
    modifiedVacation:VacationModel
    vacations:VacationModel[]
    enableText:boolean
    isFlipped:boolean
    flippedVacation:number
    modelOpen:boolean
    errors:{startDateError:string,endDateError:string,descriptionError:string,destinationError:string,priceError:string}

}

export class AdminSpace extends Component<any,AdminSpaceState>{
    constructor(props:any){
        super(props)
        this.state={
            adminInfo: new UsersModel(),
            isAdmin:false,
            logged:false,
            modifiedVacation: new VacationModel(),
            vacations:[],
            enableText:false,
            isFlipped:false,
            flippedVacation:null,
            modelOpen:false,
            errors:{startDateError:'*',endDateError:'*',descriptionError:'*',destinationError:'*',priceError:'*'}
        }
    }

    private handleClick=(vacationId:number)=>{
        this.setState({flippedVacation:vacationId})
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
        let modifiedVacation = {...this.state.modifiedVacation};
        modifiedVacation.description = undefined
        modifiedVacation.destination = undefined
        modifiedVacation.startDate = undefined
        modifiedVacation.endDate = undefined
        modifiedVacation.price = undefined
        modifiedVacation.vacationId = vacationId;
        this.setState({modifiedVacation});
    }

    async componentWillMount(){
        const adminInfo = this.props.setUserInfo();
        const logged = this.props.isUserLogged();
        this.setState({logged,adminInfo},()=>{
            !this.isAdmin()? this.setState({isAdmin:false}):this.setState({isAdmin:true})
        })
    }

    private isAdmin=async()=>{
        try{
            const url = Config.serverUrl;
            await axios.get(`${url}/api/validator/isUserAdmin/${this.state.adminInfo.uuid}`);
        }catch(err){

        }
    }

    async componentDidMount(){
        setTimeout(() => {
            this.setState({enableText:true})
        }, 2000);
       await this.getVacations();
        socket.on("admin-change", (UpdatedVacations:any) => {
            const vacations = UpdatedVacations;
            this.setState({vacations})
        });
    }

public getVacations=async()=>{
    try{
       const url = Config.serverUrl;
       const response = await axios.get<VacationModel[]>(`${url}/api/vacations/getAllVacations`);
       const vacations = response.data;
       this.setState({vacations});
    }catch(err){
        console.log(err.message)
    }
}
    public setDestination=(args:ChangeEvent<HTMLInputElement>)=>{
        const destination = args.target.value;
        const modifiedVacation = {...this.state.modifiedVacation};
        modifiedVacation.destination = destination;
        this.setState({modifiedVacation});
    }
    public setDescription=(args:ChangeEvent<HTMLInputElement>)=>{
        const description = args.target.value;
        const modifiedVacation = {...this.state.modifiedVacation};
        modifiedVacation.description = description;
        this.setState({modifiedVacation});
    }
    public setStartDate=(args:ChangeEvent<HTMLInputElement>)=>{
        const startDate = args.target.value;
        const modifiedVacation = {...this.state.modifiedVacation};
        modifiedVacation.startDate = startDate;
        this.setState({modifiedVacation});
    }
    public setEndDate=(args:ChangeEvent<HTMLInputElement>)=>{
        const endDate = args.target.value;
        const modifiedVacation = {...this.state.modifiedVacation};
        modifiedVacation.endDate = endDate;
        this.setState({modifiedVacation});
    }
    public setPrice=(args:ChangeEvent<HTMLInputElement>)=>{
        const price = +args.target.value;
        const modifiedVacation = {...this.state.modifiedVacation};
        modifiedVacation.price = price;
        this.setState({modifiedVacation});
    }



    private modifyVacation =async(vacationId:number) =>{
        try{

        const url = Config.serverUrl;
        await axios.post<VacationModel>(`${url}/api/vacations/modify`,this.state.modifiedVacation);
        this.handleClick(vacationId);
        }catch(err){
            console.log(err.message)
        }
    }

    private deleteVacation=async(vacationId:number)=>{
        try{
            const url = Config.serverUrl;
            await axios.delete(`${url}/api/vacations/removeVacation/${vacationId}`)
            this.handleClick(vacationId);
        }catch(err){
            console.log(err.message)
        }
    }

    public openModel=()=>{
        this.setState({modelOpen:true})
    }
    
    public closeModel=()=>{
        this.setState({modelOpen:false})
    }
    

    render(){
        
        return(
            
            this.state.enableText  ? this.state.logged === false || this.state.isAdmin === false ? <Redirect to='/'/> :
            <Grid container xs={12} direction="column"  alignItems="center" justify="center" style={{ minHeight: '85vh' }}>
                <Box m={4}>
                    <Typography component="h1" variant="h2" style={{textShadow:'1px 1px 1px black'}}>
                        Admin Zone
                    </Typography>
                </Box>
                <Box m={2}>
                    <Typography component="h1" variant="h5" style={{textAlign:'center',textShadow:'1px 1px 1px black'}}>
                        Press On a vacation to modify or delete it, be careful users will be notified immediately! 
                    </Typography>
                </Box>
                <Grid container direction="row"  alignItems="center" justify="center">
                    {this.state.vacations.map(v=>{
                       return <Grid item container xs={12} md={4} justify="center" className='vacationContainer' key={v.vacationId}>
                                    <ReactCardFlip  isFlipped={this.state.isFlipped && this.state.flippedVacation === v.vacationId} flipDirection="horizontal">
                                        <Paper  className='vacationContainerBackground' onClick={()=>{this.handleClick(v.vacationId)}}
                                        style={{minWidth:'320px',minHeight:'510px' ,background:` linear-gradient(0deg, rgba(216, 95, 166, 0.541), rgba(255, 189, 103, 0.438)), url("${Config.serverUrl}/uploads/${v.vacationImg}")`}}>
                                            <Box ml={2}>
                                                <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                                                    <Typography  gutterBottom variant="subtitle1">{v.destination}</Typography>
                                                </Grid>
                                            </Box>
                                            <Box mr={2}>
                                            <Grid container direction="row" justify="flex-end" alignItems="flex-end">
                                            </Grid>
                                            </Box>
                                            <Grid className='vacationDescriptionAdmin' container direction="row" justify="center" alignItems="center" style={{height:'170px'}}>
                                                <Typography gutterBottom variant="subtitle1">{v.description}</Typography>
                                            </Grid>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                                <Typography gutterBottom variant="subtitle1">Dates - {v.startDate} - {v.endDate}</Typography>
                                            </Grid>
                                            <Grid container direction="row" justify="center" alignItems="flex-end" >
                                                <Typography gutterBottom variant="subtitle1">Now for Just - {v.price} $ per Person!</Typography>
                                            </Grid>
                                        </Paper>
                                        <Paper className='vacationContainerBackground' 
                                        style={{width:'320px',minHeight:'510px', background:` linear-gradient(0deg, rgba(216, 95, 166, 0.541), rgba(255, 189, 103, 0.438)), url("${Config.serverUrl}/uploads/${v.vacationImg}")`}}>
                                                <Grid container direction="row" justify="center" alignItems="center">
                                                <Typography className='title' gutterBottom variant="subtitle1">Destination</Typography>
                                                    <TextField onChange={this.setDestination}
                                                       value={this.state.modifiedVacation.destination || ''}
                                                       name='destination' /> 
                                                </Grid>
                                            <Grid container direction="row" justify="center" alignItems="center" style={{height:'100px'}}>
                                            <Typography className='title' gutterBottom variant="subtitle1">Description</Typography>
                                                <TextField onChange={this.setDescription}
                                                value={this.state.modifiedVacation.description || ''}
                                                name='description'/>
                                            </Grid>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                            <Typography className='title' gutterBottom variant="subtitle1">Start Date</Typography>
                                                <TextField onChange={this.setStartDate}
                                                value={this.state.modifiedVacation.startDate || ''}                                              
                                                id="startDate"
                                                label="Start Date"
                                                type="date"
                                                InputLabelProps={{shrink: true,}}/>
                                            </Grid>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                                <Typography className='title' gutterBottom variant="subtitle1">End Date</Typography>
                                                <TextField onChange={this.setEndDate}
                                                value={this.state.modifiedVacation.endDate || ''}                                              
                                                id="endDate"
                                                label="End Date"
                                                type="date"
                                                InputLabelProps={{shrink: true,}}/>
                                            </Grid>
                                            <Grid container direction="row" justify="center" alignItems="flex-end" >
                                            <Typography className='title' gutterBottom variant="subtitle1">Price</Typography>   
                                                <TextField onChange={this.setPrice}
                                                value={this.state.modifiedVacation.price || ''}  
                                                name='price'/>
                                            </Grid>
                                            <Grid  container direction="row" justify="center" alignItems="flex-end">
                                            <iframe name={`${v.vacationId}`} title={`${v.vacationId}`} style={{display:'none'}}></iframe>
                                                <form
                                                   target={`${v.vacationId}`}
                                                    method="post"
                                                    action={`${Config.serverUrl}/api/vacations/modify`}
                                                    encType="multipart/form-data">
                                                    <input defaultValue={`${v.vacationId}`} name='vacationId' style={{display:'none'}} />
                                                    <input type="file" name="vacationImg"  accept="image/*"/>
                                                    <input defaultValue={sessionStorage.getItem('token')} name="AdminUuid" style={{display:'none'}}/>
                                                    <input defaultValue={this.state.adminInfo.isAdmin} name="isAdmin" style={{display:'none'}}/>
                                                    <br/>
                                                    <Grid container direction="row" justify="center" alignItems="flex-end">
                                                        <Button type='submit' variant="contained" color="primary" onClick={()=>{this.modifyVacation(v.vacationId)}}>
                                                                    Submit Changes
                                                        </Button>
                                                    </Grid>
                                                </form>        
                                            </Grid>
                                            <Box mt={2}>
                                                <Grid  container direction="row" justify="center" alignItems="flex-end">
                                                    <Button variant="contained" color='secondary' onClick={()=>{this.deleteVacation(v.vacationId)}}>Delete Vacation</Button>
                                                </Grid>
                                            </Box>
                                        </Paper>
                                    </ReactCardFlip>
                                </Grid>   
                    })}
                </Grid>
                <Grid  container direction="column" justify="center" alignItems="center">
                    <Typography component="h1" variant="h3">
                        Add Vacation 
                    </Typography>
                    <Box mt={2}>
                        <Typography component="h1" variant="h5" style={{textAlign:'center',padding:'20px',textShadow:'1px 1px 1px black'}}>
                            Press The Button and use the pop-up Model to add a new vacation to the site.
                        </Typography>
                    </Box>
                    <Box mt={5} mb={5}>
                        <Button onClick={()=>{this.openModel()}} variant="contained" color='primary'>Press To Add Vacation</Button>
                    </Box>
                    <Modal
                        open={this.state.modelOpen}
                        onClose={this.closeModel}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description">
                            <Box mt={2} style={{marginLeft:'10px',marginRight:"10px"}}>
                             <AddVacation  closeModal ={this.closeModel}/>
                            </Box>
                    </Modal>
                </Grid>
            </Grid>
        : <div className='loadingGif'></div>)
    }
}
