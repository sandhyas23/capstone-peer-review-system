/* Basic view for students
* This content is rendered when user is logged in as student*/

import React from 'react';
import TaskSubmit from "./taskSubmit";
import {
    Grid,
    Icon,
    Menu,
    Sidebar,
    Container,
    Segment,
    Header,
    Button
} from 'semantic-ui-react';
import TaskReview from "./taskReview";
import ViewSubmission from "./viewSubmission";
import ViewReviewed from './viewReviewed';
import Prism from "prismjs";


export default class StudentView extends React.Component{
    constructor(props){
        super(props);
        this.state = {submissionTasks:[] ,reviewTasks:[], mode:"", submissions:[], studentAssignment:[],
        reviews:[], firstName:props.firstName , lastName:props.lastName}

    }

    // Get all tasks and submission details from database to display initially
    componentDidMount() {
        let _this = this;
        fetch('http://54.191.195.63:3000/submissionTask',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            console.log("this is what we got" +data.submissionTasks);
            _this.setState({submissionTasks: data.submissionTasks});

        });

        fetch('http://54.191.195.63:3000/reviewTask',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            console.log("this is what we got" +data.reviewTasks);
            _this.setState({reviewTasks: data.reviewTasks});

        });


        fetch('http://54.191.195.63:3000/submissions/',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            console.log("this is what we got in task submit" +data.submissions);
            //_this.state.submissions.push(data.submission);
            _this.setState({"submissions": data.submissions});


        });

        fetch('http://54.191.195.63:3000/reviews/',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            console.log("this is what we got in task submit" +data.reviews);
            //_this.state.submissions.push(data.submission);
            _this.setState({"reviews": data.reviews});


        });

        fetch('http://54.191.195.63:3000/studentAssignment/',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            console.log("this is what we got in task submit" +data.studentAssignment);
            //_this.state.submissions.push(data.submission);
            _this.setState({"studentAssignment": data.studentAssignment});


        });
        Prism.highlightAll();
    }

    // function to set state of current open submission task that is clicked
    handleOpenSubmissionItemClick(event, task){
       // console.log("taskclicked" +task["task-name"]);
        this.setState({mode:"submit", currentTask:task})
        //console.log("ccc",this.state.currentTask);
    }

    // function to set state of current closed submission task that is clicked
    handleClosedSubmissionItemClick(event, task){
        // console.log("taskclicked" +task["task-name"]);
        this.setState({mode:"submitted", currentTask:task})
        //console.log("ccc",this.state.currentTask);
    }

    // function to set state of current open review task that is clicked
    handleOpenReviewItemClick(event, task){
        //console.log("taskclicked" +task["task-name"]);
        this.setState({mode:"review", currentTask:task})
        //console.log("ddd",this.state.currentTask);
    }

    // function to set state of current closed review task that is clicked
    handleClosedReviewItemClick(event, task){
        //console.log("taskclicked" +task["task-name"]);
        this.setState({mode:"reviewed", currentTask:task})
        //console.log("ddd",this.state.currentTask);
    }

    // toggle between different views for student based on the task type clicked
    handleViewComponent(){
        const viewMode = this.state.mode;
        if(viewMode === "submit"){
            //console.log("cliked" +this.state.currentTask["task-name"]);
            return <TaskSubmit currentTask = {this.state.currentTask} netId={this.props.netId}/>


        }
        else if(viewMode === "review"){
           // console.log("cliked" +this.state.currentTask["task-name"]);
            return <TaskReview currentTask = {this.state.currentTask} netId={this.props.netId}
            reviewTask = {this.state.reviewTasks} studentAssignment={this.state.studentAssignment}
            submissions={this.state.submissions} reviews={this.state.reviews}/>
        }
        else if(viewMode === "submitted"){
            // console.log("cliked" +this.state.currentTask["task-name"]);
            return <ViewSubmission currentTask = {this.state.currentTask} netId={this.props.netId}
                               reviewTask = {this.state.reviewTasks} studentAssignment={this.state.studentAssignment}
                               submissions={this.state.submissions} reviews={this.state.reviews}/>
        }

        else if(viewMode === "reviewed"){
            // console.log("cliked" +this.state.currentTask["task-name"]);
            return <ViewReviewed currentTask = {this.state.currentTask} netId={this.props.netId}
                               reviewTask = {this.state.reviewTasks} studentAssignment={this.state.studentAssignment}
                               submissions={this.state.submissions} reviews={this.state.reviews}/>
        }

        else{
            // in homepage, display the tasks to complete both, submission and review
            let openSubmissionTaskItems = this.state.submissionTasks.map((task , index , array) => {
                let taskDue = new Date(task["due"]).getTime();
                let now = new Date().getTime();
                const timeDifference = now-taskDue;
                //console.log("time of",task["task-name"],timeDifference);
                if(timeDifference < 0){
                    return <Menu.Item
                        name={task["task-name"]}
                        key = {`osstask${index}`}
                        onClick={(event) => this.handleOpenSubmissionItemClick(event,task)}
                        active={task === this.state.currentTask}
                    >
                    <span>
                        <Icon name ="tag" />
                        {task["task-name"]}
                    </span>
                    </Menu.Item>

                }
            });


            // get all open review tasks to display in the menu
            let openReviewTaskItems = this.state.reviewTasks.map((task , index , array) => {
                let taskDue = new Date(task["due"]).getTime();
                let now = new Date().getTime();
                const timeDifference = now-taskDue;
                //console.log("time of",task["task-name"],timeDifference);
                if(timeDifference < 0){
                    return <Menu.Item
                        name={task["peer-review-for"]}
                        key = {`ortask${index}`}
                        onClick={(event) => this.handleOpenReviewItemClick(event,task)}
                        active={task === this.state.currentTask}
                    >
                    <span>
                        <Icon name ="tag" />
                        {task["peer-review-for"]}
                    </span>
                    </Menu.Item>

                }
            });


            return <div><Segment placeholder style={{overflow: 'auto',minHeight:230,maxHeight:330,maxWidth:1000,minWidth:200 }}>
                <Header icon>
                    <Icon name='tag' />
                   You have the following assignments to submit
                </Header>
                <Menu>
                    {openSubmissionTaskItems}
                </Menu>
            </Segment>
                <Segment placeholder style={{overflow: 'auto',minHeight:230,maxHeight:330,maxWidth:1000,minWidth:200 }}>
                    <Header icon>
                        <Icon name='tag' />
                        You have the following reviews to submit
                    </Header>
                    <Menu>
                        {openReviewTaskItems}
                    </Menu>
                </Segment>

            </div>
        }
    }



    render(){
        // get all open submission tasks to display in the menu
        let openSubmissionTaskItems = this.state.submissionTasks.map((task , index , array) => {
            let taskDue = new Date(task["due"]).getTime();
            let now = new Date().getTime();
            const timeDifference = now-taskDue;
            //console.log("time of",task["task-name"],timeDifference);
            if(timeDifference < 0){
                return <Menu.Item
                    name={task["task-name"]}
                    key = {`ostask${index}`}
                    onClick={(event) => this.handleOpenSubmissionItemClick(event,task)}
                    active={task === this.state.currentTask}
                >
                    <span>
                        <Icon name ="tag" />
                        {task["task-name"]}
                    </span>
                </Menu.Item>

            }
        });

        // get all closed submission tasks to display in the menu
        let closedSubmissionTaskItems = this.state.submissionTasks.map((task , index , array) => {
            let taskDue = new Date(task["due"]).getTime();
            let now = new Date().getTime();
            const timeDifference = now-taskDue;
            if(timeDifference >= 0){
                return <Menu.Item
                    name={task["task-name"]}
                    key = {`cstask${index}`}
                    onClick={(event) => this.handleClosedSubmissionItemClick(event,task)}
                    active={task === this.state.currentTask}
                >
                    <span>
                        <Icon name ="tag" />
                        {task["task-name"]}
                    </span>
                </Menu.Item>

            }
        });

        // get all open review tasks to display in the menu
        let openReviewTaskItems = this.state.reviewTasks.map((task , index , array) => {
            let taskDue = new Date(task["due"]).getTime();
            let now = new Date().getTime();
            const timeDifference = now-taskDue;
            //console.log("time of",task["task-name"],timeDifference);
            if(timeDifference < 0){
                return <Menu.Item
                    name={task["peer-review-for"]}
                    key = {`ortask${index}`}
                    onClick={(event) => this.handleOpenReviewItemClick(event,task)}
                    active={task === this.state.currentTask}
                >
                    <span>
                        <Icon name ="tag" />
                        {task["peer-review-for"]}
                    </span>
                </Menu.Item>

            }
        });

        // get all closed review tasks to display in the menu
        let closedReviewTaskItems = this.state.reviewTasks.map((task , index , array) => {
            let taskDue = new Date(task["due"]).getTime();
            let now = new Date().getTime();
            const timeDifference = now-taskDue;
            //console.log("time of",task["task-name"],timeDifference);
            if(timeDifference >= 0){
                return <Menu.Item
                    name={task["peer-review-for"]}
                    key = {`crtask${index}`}
                    onClick={(event) => this.handleClosedReviewItemClick(event,task)}
                    active={task === this.state.currentTask}
                >
                    <span>
                        <Icon name ="tag" />
                        {task["peer-review-for"]}
                    </span>
                </Menu.Item>

            }
        });

    return<div>
        <div>
        <Sidebar
            as={Menu}
            animation='push'
            direction='left'
            icon='labeled'
            inverted
            visible={true}
            vertical
            width='thin'


        >
            {/*Sidebar with all task names*/}

            <Menu.Item>
                <Icon name ="tasks"></Icon><Menu.Header>Tasks to submit</Menu.Header>
                <Menu.Menu>
                    {openSubmissionTaskItems}
                </Menu.Menu>
            </Menu.Item>

            <Menu.Item>
                <Icon name ="tasks"></Icon><Menu.Header>Tasks to Review</Menu.Header>

                <Menu.Menu>
                    {openReviewTaskItems}
                </Menu.Menu>
            </Menu.Item>

            <Menu.Item>
                <Icon name ="tasks"></Icon><Menu.Header>my Submissions</Menu.Header>

                <Menu.Menu>
                    {closedSubmissionTaskItems}
                </Menu.Menu>

            </Menu.Item>

            <Menu.Item>
                <Icon name ="tasks"></Icon><Menu.Header>View reviews for my assignments</Menu.Header>

                <Menu.Menu>
                    {closedReviewTaskItems}
                </Menu.Menu>

            </Menu.Item>

        </Sidebar>

            {/*Top fixed menu with user details and Logout button*/}
        </div>
        <Menu fixed='top' stackable inverted>
            <Container>
                <Menu.Item as='h4'
                           header
                           position={"right"}
                            onClick={()=> this.setState({mode:"",currentTask:""})}>
                    Peer Review System
                </Menu.Item>
                <Menu.Item
                    as='a'
                    position={"right"}
                >{`Welcome, ${this.props.netId} ${this.props.firstName}${this.props.lastName}`}</Menu.Item>
                <Menu.Item
                    as='a'
                    position={"right"}
                    margin-right={"150px"}
                    onClick ={this.props.onlogoutClick}
                >Logout</Menu.Item>
            </Container>
        </Menu>


        <div style={{marginLeft: 170, minWidth: 550, marginTop:50}}>
        <Grid padded  stackable>

            <Grid.Column >
           {/*toggle different between views for student based on task click*/}
            {this.handleViewComponent()}

               </Grid.Column>

        </Grid>
    </div>

    </div>

    }
}

