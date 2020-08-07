import React, { Component } from 'react';
import './admin-chart.css';
import { Grid, Paper, Typography, Box } from '@material-ui/core';
import { UsersModel } from '../../models/users-model';
import { Redirect } from 'react-router-dom';
import { VacationModel } from '../../models/vacation-model';
import axios from 'axios';
import {Config} from '../../config'
import {Bar} from 'react-chartjs-2';
import socketIOClient  from "socket.io-client";
const socket = socketIOClient(Config.serverUrl);





interface AdminChartState{
    isAdmin:boolean,
    logged:boolean
    userInfo:UsersModel
    enableText:boolean
    chartData:{labels:string[],datasets:[{label:string,backgroundColor:string,borderColor:string,borderWidth:number,barThickness:number,data:number[]}]}
}


export class AdminChart extends Component<any,AdminChartState>{
    constructor(props:any){
        super(props)
        this.state={
            isAdmin:false,
            logged:false,
            userInfo:new UsersModel(),
            enableText:false,
            chartData:{labels:[],datasets:[{label:'Followers',backgroundColor:'rgba(255, 160, 51, 0.493)',borderColor:'rgba(255, 160, 51, 0.76)',borderWidth:2.,barThickness:50,data:[]}]}
        }
    }

    async componentWillMount(){
        const userInfo = this.props.setUserInfo();
        const logged =  this.props.isUserLogged();
        this.setState({logged,userInfo})
    }

   async componentDidMount(){
       setTimeout(() => {
           this.setState({enableText:true})
       }, 2000);
        const admin = await this.isAdmin();
       !admin ? this.setState({isAdmin:false}):this.setState({isAdmin:true})
        await this.getVacations();
        socket.on("admin-change", (UpdatedVacations:any) => {
            let chartData = {...this.state.chartData};
            chartData.datasets[0].data = UpdatedVacations.map((v:any)=>v.numberOfFollowers)
            this.setState({chartData})
        });
    }

    public getVacations=async()=>{
        try{
            let chartData = {...this.state.chartData};
           const url = Config.serverUrl;
           const response = await axios.get<VacationModel[]>(`${url}/api/vacations/getAllVacations`);
           const chartDataResp = response.data;
           const correctChartData = chartDataResp.filter(v=>v.numberOfFollowers>0)
           chartData.labels = correctChartData.map(v=>v.destination)
           chartData.datasets[0].data = correctChartData.map(v=>v.numberOfFollowers)
           this.setState({chartData});
        }catch(err){
            console.log(err.message)
        }
    }

    private isAdmin=async()=>{
        try{
            const url = Config.serverUrl;
            const response = await axios.get(`${url}/api/validator/isUserAdmin/${this.state.userInfo.isAdmin}`);
            return response.data
        }catch(err){

        }
    }


    render(){
        return(
        this.state.enableText ? this.state.logged === false || this.state.isAdmin === false ? <Redirect to='/'/> : 
            <Grid container alignItems="center" justify="center" direction="column"> 
                <Box mb={5}>
                    <Typography>
                        The Chart below shows the numbers of followers per Vacation (Only vacations with more then one follower will show here)
                    </Typography>
                </Box>
                <Grid className='chart'>
                    <Bar 
                    data={this.state.chartData}
                    options={{
                        responsive:true,
                        maintainAspectRatio:true,
                        scales: {
                            xAxes: [{
                                ticks: {
                                    fontColor:'gray',
                                    fontSize:15
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function (value:any) { if (Number.isInteger(value)) { return value; } },
                                    stepSize: 1,
                                    fontColor:'gray',
                                    fontSize:15
                                }
                            }]
                        },
                        title:{
                            display:true,
                            text:'Followers Per Vacation',
                            fontSize:20
                        },
                        legend:{
                            display:true,
                            position:'right',
                            labels: {
                                fontColor: 'gray',
                                fontSize:15
                            }
                        }
                    }}>

                    </Bar>
                    
                </Grid>
            </Grid>
        :<div className='loadingGif'></div>)
    }
}