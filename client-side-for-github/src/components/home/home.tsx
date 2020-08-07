import React, { Component, ChangeEvent } from 'react';
import './home.css'
import { UsersModel } from '../../models/users-model';
import { VacationModel } from '../../models/vacation-model';
import { UserVsVacations } from '../../models/users-vs-vacations';
import { Grid, Box, Typography, Paper, Button, TextField, Modal } from '@material-ui/core';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import {Config} from '../../config'
import Swal from 'sweetalert2'
import socketIOClient  from "socket.io-client";


const socket = socketIOClient(Config.serverUrl);




interface HomeState{
    logged:boolean
    userInfo: UsersModel
    pickedVacations:VacationModel[]
    unPickedVacations:VacationModel[]
    enableText:boolean
    usersVsVacations:UserVsVacations
    pickedVacation:number
    disappear:string
    search:string
    searchResults:VacationModel[]
    modalOpen:boolean
    modalVacation:number
}
export class Home extends Component<any,HomeState>{
    constructor(props:any){
        super(props)
        this.state={
            logged:false,
            userInfo: new UsersModel(),
            pickedVacations:[],
            unPickedVacations:[],
            enableText:false,
            usersVsVacations:new UserVsVacations(),
            pickedVacation:null,
            disappear:'',
            search:'',
            searchResults:[],
            modalOpen:false,
            modalVacation:null
        }
    }

    componentWillMount(){
        axios.defaults.headers.common['Authorization'] = "Bearer " + sessionStorage.getItem("token") ;
        axios.defaults.headers.common['userLogged'] =  JSON.parse(sessionStorage.getItem("user"))?.uuid;
        axios.defaults.headers.common['admin'] =  JSON.parse(sessionStorage.getItem("user"))?.isAdmin;
        const userInfo = this.props.setUserInfo();
        const logged = this.props.isUserLogged();
        this.setState({logged,userInfo})
    }
   async componentDidMount(){
       this.props.enableMenu();
       document.body.style.backgroundImage = "url('/assets/home-wallpaper.jpg')"
       setTimeout(() => {
           this.setState({enableText:true})
       }, 2000);
        await this.getVacations();
        socket.on("admin-change", (UpdatedVacations:any) => {
            const pickedVacationsArray = this.state.pickedVacations.map((p:any)=>UpdatedVacations.filter((pV:any)=> pV.vacationId === p.vacationId));
            let pickedVacations = [];
            for(let item in pickedVacationsArray){
               if(pickedVacationsArray[item].length!==0){
                pickedVacations.push(pickedVacationsArray[item][0]);
                 this.setState({pickedVacations})
               }
            }
            const unPickedVacationsArray = this.state.unPickedVacations.map((p:any)=>UpdatedVacations.filter((pV:any)=> pV.vacationId === p.vacationId));
            let unPickedVacations = [];
            for(let item in unPickedVacationsArray){
                if(unPickedVacationsArray[item].length===0){
                    return;
                }
                unPickedVacations.push(unPickedVacationsArray[item][0]);
                this.setState({unPickedVacations})
            }
        });
    }

    componentWillUnmount(){
        document.body.style.backgroundImage  = "linear-gradient(0deg, rgba(216, 95, 166, 0.308), rgba(255, 189, 103, 0.466)), url('/assets/login-wallpaper.jpg')"
    }

    private getVacations =async()=>{
        try{
            const url = Config.serverUrl;
            const pickedVacationsResp = await axios.get<VacationModel[]>(`${url}/api/vacations/getPickedVacations/${this.state.userInfo.userId}`);
            const pickedVacations = pickedVacationsResp.data;
            this.setState({pickedVacations})
            const pickedVacationsArray = this.state.pickedVacations.map(p=>p.vacationId)
            const unPickedVacationResp = await axios.post<VacationModel[]>(`${url}/api/vacations/getUnPickedVacations`,
                {data:{userId:this.state.userInfo.userId,pickedVacations:pickedVacationsArray}});
            const unPickedVacations = unPickedVacationResp.data
            this.setState({unPickedVacations})
        }catch(err){
            if(err.response){
                if(err.response.status === 403){
                    Swal.fire({
                    title: 'Disconnected!',
                    text: `Session has expired, please login again`,
                    icon: 'error',
                    confirmButtonText: 'O.K'
                    })
                    this.props.history.push('/login');
                }
            }
            else{
                console.log(err.message)
                this.props.history.push('/login');
            }
        }
    }
 



    private followVacation =async(vacationId:number)=>{
        try{
            this.setState({pickedVacation:vacationId,disappear:'disappear'});
                    const url = Config.serverUrl;
                    await axios.post<UserVsVacations>(`${url}/api/vacations/followVacation`,{data:{userId:this.state.userInfo.userId,vacationId:vacationId}});
                    await this.getVacations();
        }catch(err){
            if(err.response.status === 403){
                Swal.fire({
                    title: 'Error!',
                    text: `Admin Cannot Follow vacations, please switch to a regular account`,
                    icon: 'error',
                    confirmButtonText: 'O.K'
                  })
                  return;
            }
        }
    }

    private unFollowVacation =async(vacationId:number)=>{
        try{
            this.setState({pickedVacation:vacationId,disappear:'disappear'})
                const url = Config.serverUrl;
                await axios.delete(`${url}/api/vacations/unfollowVacation`,{data:{vacationId:vacationId,userId:this.state.userInfo.userId}});
                await this.getVacations();
        }catch(err){
            if(err.response.status === 403){
                Swal.fire({
                    title: 'Error!',
                    text: `Admin Cannot unFollow vacations, please switch to a regular account`,
                    icon: 'error',
                    confirmButtonText: 'O.K'
                  })
                  return;
            }
        }
    }

    
    public openModel=(id:number)=>{
        this.setState({modalOpen:true,modalVacation:id})
    }
    
    public closeModel=()=>{
        this.setState({modalOpen:false})
    }
    

    public searchVacation = (args:ChangeEvent<HTMLInputElement>) =>{
        let search = args.target.value.toLowerCase();
        this.setState({search})
        let vacations = this.state.pickedVacations.concat(this.state.unPickedVacations);
        let searchResults = vacations.filter(v=>v.destination.toLocaleLowerCase().includes(search));
        this.setState({searchResults});
    }


    render(){
        return(
            this.state.logged === false ? <Redirect to='/'/> : !this.state.enableText ? <div className='loadingGif'></div> : 
            <Grid container>
                <Grid container className='vacationSearchBar' alignItems="flex-start" justify="flex-end" direction="row">
                <Box>
                    <Grid container>
                        <Box mr={5}>
                            <TextField onChange={this.searchVacation}
                                value={this.state.search || ''}
                                label="Search Vacation"/>
                        </Box>
                    </Grid>
                </Box>
                </Grid>
                <Box mb={2} ml={2}>
                    <Grid container alignItems="flex-start" justify="flex-start" direction="row" >
                        <Typography component="h1" variant="h6">
                                Welcome - {`${this.state.userInfo.firstName}`}
                        </Typography>
                    </Grid>
                </Box>
                    <Grid container alignItems="flex-start" justify="flex-start" direction="row"style={{ minHeight: '50vh'}}>
                        {this.state.search.length===0?
                        <Grid container>
                            <Box ml={4} mb={2}>   
                                <Typography  component="h1" variant="h4">
                                    Vacations You Follow!
                                </Typography>
                            </Box>
                            <Grid item container style={{ minHeight: '40vh'}}>
                            {this.state.pickedVacations.map(v=>{
                                return <Grid item container  xs={12} sm={4} justify="center" 
                                className={`vacationContainer ${this.state.pickedVacation===v.vacationId?this.state.disappear:''}`} key={v.vacationId}>
                                <Paper className='vacationContainerBackground' 
                                style={{background:` linear-gradient(0deg, rgba(216, 95, 166, 0.341), rgba(255, 189, 103, 0.150)), url("${Config.serverUrl}/uploads/${v.vacationImg}")`}}>
                                    <Box ml={2}>
                                        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                                            <Typography gutterBottom variant="h4" className='destH4'>{v.destination}</Typography>
                                        </Grid>
                                    </Box>
                                    <Box mr={2}>
                                    <Grid container direction="row" justify="flex-end" alignItems="flex-end">
                                        <span className='unFollow' onClick={()=>{this.unFollowVacation(v.vacationId)}}></span>
                                    </Grid>
                                    </Box>
                                    <Box display='flex'>
                                        <Grid item xs={9} className='vacationDescription' container direction="row" justify="center" alignItems="center" style={{height:'170px'}}>
                                        <Paper className='descContainer'>
                                            <Typography gutterBottom variant="subtitle1">{v.description}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={3} container direction="row" justify="flex-end" alignItems="flex-end">
                                                <div style={{textAlign:'center'}} className='followerBackground'>
                                                    <p>Number Of Followers</p>
                                                    <Typography style={{textAlign:'center'}}>{v.numberOfFollowers}</Typography>  
                                                </div>
                                        </Grid>
                                    </Box>
                                    <Grid container direction="row" justify="center" alignItems="center">
                                        <Typography gutterBottom variant="h5" style={{textAlign:'center'}}>Dates<br/> - From {v.startDate} - To {v.endDate} -</Typography>
                                    </Grid>
                                    <Grid container direction="row" justify="center" alignItems="flex-end" >
                                        <Typography gutterBottom variant="subtitle1">Now for Just - {v.price} $ per Person!</Typography>
                                    </Grid>
                                    <Box>
                                        <Button className='mobileDetail' variant="contained" onClick={()=>{this.openModel(v.vacationId)}}>Vacation Information</Button>
                                    </Box>
                                </Paper>
                                <Modal
                                open={this.state.modalOpen}
                                onClose={this.closeModel}  
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description">
                                    <Box mt={10} style={{marginLeft:'10px',marginRight:"10px"}}>
                                        {this.state.pickedVacations.filter(pV=>pV.vacationId === this.state.modalVacation).map(result=>{
                                            return <Paper className='vacationInformation' key={result.vacationId} 
                                            style={{background:` linear-gradient(0deg, rgba(216, 95, 166, 0.141), rgba(255, 189, 103, 0.138)), url("${Config.serverUrl}/uploads/${result.vacationImg}")`}}>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                            <Typography>
                                                {result.destination}
                                            </Typography>
                                            </Grid>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                                <Typography>
                                                    {result.description}
                                                </Typography>
                                            </Grid>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                                <Typography>
                                                    From - {result.startDate} To - {result.endDate}
                                                </Typography>
                                            </Grid>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                                <Typography>
                                                    Only for {result.price}$ per person
                                                </Typography>
                                            </Grid>
                                        </Paper>
                                        })}
                                    </Box>
                                </Modal>
                            </Grid>
                            })}
                        </Grid>
                        <Box m={4}>
                          <Typography component="h1" variant="h4">Our Selection Of New Offers for you!</Typography>
                        </Box>
                        <Grid container style={{ minHeight: '40vh'}}>
                            {this.state.unPickedVacations.map(v=>{
                                return <Grid item container xs={12} sm={4} justify="center"  
                                className={`vacationContainer appear ${this.state.pickedVacation===v.vacationId&&this.state.disappear!==''?this.state.disappear:''}`} key={v.vacationId}>
                                <Paper className='vacationContainerBackground' 
                                style={{background:` linear-gradient(0deg, rgba(216, 95, 166, 0.141), rgba(255, 189, 103, 0.138)), url("${Config.serverUrl}/uploads/${v.vacationImg}")`}}>
                                    <Box ml={2}>
                                        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                                            <Typography gutterBottom variant="h4" className='destH4'>{v.destination}</Typography>
                                        </Grid>
                                    </Box>
                                    <Box mr={2} display='inline'>
                                    <Grid container direction="row" justify="flex-end" alignItems="flex-end">
                                         <span className='follow' onClick={()=>{this.followVacation(v.vacationId)}}></span>
                                    </Grid>
                                    </Box>
                                    <Box display='flex'>
                                        <Grid container item className='vacationDescription'  xs={9} direction="row" justify="center" alignItems="center" style={{height:'170px'}}>
                                            <Paper className='descContainer'>
                                            <Typography gutterBottom variant="subtitle1">{v.description}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item container xs={3} direction="row" justify="flex-end" alignItems="flex-end">
                                                <div style={{textAlign:'center'}} className='followerBackground'>
                                                    <Typography>Number Of Followers</Typography>
                                                    <Typography style={{textAlign:'center'}}>{v.numberOfFollowers}</Typography>  
                                                </div>
                                        </Grid>
                                    </Box>
                                    <Grid container direction="row" justify="center" alignItems="center">
                                    <Typography gutterBottom variant="h5" style={{textAlign:'center'}}>Dates<br/> - From {v.startDate} - To {v.endDate} -</Typography>
                                    </Grid>
                                    <Grid container direction="row" justify="center" alignItems="flex-end" >
                                        <Typography gutterBottom variant="subtitle1">Now for Just - {v.price} $ per Person!</Typography>
                                    </Grid>
                                    <Box>
                                        <Button className='mobileDetail' variant="contained" color='primary' onClick={()=>{this.openModel(v.vacationId)}}>Vacation Information</Button>
                                    </Box>
                                </Paper>
                                <Modal
                                open={this.state.modalOpen}
                                onClose={this.closeModel}  
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description">
                                    <Box mt={10} style={{marginLeft:'10px',marginRight:"10px"}}>
                                    {this.state.unPickedVacations.filter(pV=>pV.vacationId === this.state.modalVacation).map(result=>{
                                            return <Paper className='vacationInformation' key={result.vacationId} 
                                            style={{background:` linear-gradient(0deg, rgba(216, 95, 166, 0.141), rgba(255, 189, 103, 0.138)), url("${Config.serverUrl}/uploads/${result.vacationImg}")`}}>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                            <Typography>
                                                {result.destination}
                                            </Typography>
                                            </Grid>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                                <Typography>
                                                    {result.description}
                                                </Typography>
                                            </Grid>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                                <Typography>
                                                    From - {result.startDate} To - {result.endDate}
                                                </Typography>
                                            </Grid>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                                <Typography>
                                                    Only for {result.price}$ per person
                                                </Typography>
                                            </Grid>
                                        </Paper>
                                        })}
                                    </Box>
                                </Modal>
                            </Grid>
                            })}
                        </Grid>
                    </Grid>:
                        <Grid container>
                             <Grid container style={{ minHeight: '40vh'}}>
                            {this.state.searchResults.map(v=>{
                                return <Grid item container xs={12} sm={4} justify="center"  
                                className={`vacationContainer appear ${this.state.pickedVacation===v.vacationId&&this.state.disappear!==''?this.state.disappear:''}`} key={v.vacationId}>
                                <Paper className='vacationContainerBackground' 
                                style={{background:` linear-gradient(0deg, rgba(216, 95, 166, 0.141), rgba(255, 189, 103, 0.138)), url("${Config.serverUrl}/uploads/${v.vacationImg}")`}}>
                                    <Box ml={2}>
                                        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                                            <Typography gutterBottom variant="h4" className='destH4'>{v.destination}</Typography>
                                        </Grid>
                                    </Box>
                                    <Box mr={2} display='inline'>
                                    <Grid container direction="row" justify="flex-end" alignItems="flex-end">
                                         <span className='follow' onClick={()=>{this.followVacation(v.vacationId)}}></span>
                                    </Grid>
                                    </Box>
                                    <Box display='flex'>
                                        <Grid container item className='vacationDescription'  xs={9} direction="row" justify="center" alignItems="center" style={{height:'170px'}}>
                                            <Paper className='descContainer'>
                                            <Typography gutterBottom variant="subtitle1">{v.description}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item container xs={3} direction="row" justify="flex-end" alignItems="flex-end">
                                                <div style={{textAlign:'center'}} className='followerBackground'>
                                                    <Typography>Number Of Followers</Typography>
                                                    <Typography style={{textAlign:'center'}}>{v.numberOfFollowers}</Typography>  
                                                </div>
                                        </Grid>
                                    </Box>
                                    <Grid container direction="row" justify="center" alignItems="center">
                                    <Typography gutterBottom variant="h5" style={{textAlign:'center'}}>Dates<br/> - From {v.startDate} - To {v.endDate} -</Typography>
                                    </Grid>
                                    <Grid container direction="row" justify="center" alignItems="flex-end" >
                                        <Typography gutterBottom variant="subtitle1">Now for Just - {v.price} $ per Person!</Typography>
                                    </Grid>
                                    <Box>
                                        <Button className='mobileDetail' variant="contained" color='primary' onClick={()=>{this.openModel(v.vacationId)}}>Vacation Information</Button>
                                    </Box>
                                </Paper>
                                <Modal
                                open={this.state.modalOpen}
                                onClose={this.closeModel}  
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description">
                                    <Box mt={10} style={{marginLeft:'10px',marginRight:"10px"}}>
                                    {this.state.searchResults.filter(pV=>pV.vacationId === this.state.modalVacation).map(result=>{
                                            return <Paper className='vacationInformation' key={result.vacationId} 
                                            style={{background:` linear-gradient(0deg, rgba(216, 95, 166, 0.141), rgba(255, 189, 103, 0.138)), url("${Config.serverUrl}/uploads/${result.vacationImg}")`}}>
                                                <Grid container item direction="row" justify="center" alignItems="center">
                                                <Typography>
                                                    {result.destination}
                                                </Typography>
                                                </Grid>
                                                <Grid container direction="row" justify="center" alignItems="center">
                                                    <Typography>
                                                        {result.description}
                                                    </Typography>
                                                </Grid>
                                                <Grid container direction="row" justify="center" alignItems="center">
                                                    <Typography>
                                                        From - {result.startDate} To - {result.endDate}
                                                    </Typography>
                                                </Grid>
                                                <Grid container direction="row" justify="center" alignItems="center">
                                                    <Typography>
                                                        Only for {result.price}$ per person
                                                    </Typography>
                                                </Grid>
                                        </Paper>
                                        })}
                                    </Box>
                                </Modal>
                            </Grid>
                            })}
                        </Grid>
                        </Grid>}
                    </Grid>
                        <video className='videoBackground' autoPlay loop muted>
                            <source src='/assets/people-at-the-beach-background.mp4'/>
                        </video>
            </Grid>
        )
    }
}


