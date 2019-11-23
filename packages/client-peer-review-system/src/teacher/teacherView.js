/*Basic view for teacher or instructor
* This is rendered when a user is logged in as a teacher
* */

import React from 'react';
import {
    Menu,
    Grid,
    Dropdown,

} from 'semantic-ui-react';
//import createdSubmissionTasks from '../data/createdSubmissionTasks';
//import createdReviewTasks from '../data/createdReviewTasks'
import Prism from "prismjs";
import CreateReviewTask from "./createReviewTask";
import StudentSubmissionSummary from "./studentSubmissionSummary";
//import submissionsHW from '../data/submissionsHw';
//import reviews from '../data/reviewTasksStudents';
import StudentReviewSummary from './studentReviewSummary';


export default class TeacherView extends React.Component{
    constructor(props){
        super(props);
        this.state = {submissionTasks:[] ,reviewTasks:[], mode:"",
        submissions:[],reviews:[], specificSubmissions:[], currentSubmissionTask:"",specificReview:[],
        currentReviewTask:"", studentAssignment:[],specAssignments:[]}
    }


    componentDidUpdate() {
        Prism.highlightAll();

    }

    // Get all submission tasks, submissions, reviews and review tasks when component is mounted
    componentDidMount() {
        let _this = this;
        fetch('/submissionTask',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            console.log("this is what we got" +data);
            _this.setState({submissionTasks: data.submissionTasks});

        });

        fetch('/submissions/',{
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
        fetch('/reviewTask',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            console.log("this is what we got" +data);
            _this.setState({reviewTasks: data.reviewTasks});

        });
        fetch('/reviews/',{
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

        fetch('/studentAssignment/',{
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

    updateArray() {
        this.setState({ submissionTasks: this.state.submissionTasks });
    }


    // Display different view components for teacher based on user click
    handleViewComponent(){
        if(this.state.mode === "createTask"){
            return <CreateReviewTask submissionTasks={this.state.submissionTasks} reviewTasks={this.state.reviewTasks}
                                     update={this.updateArray.bind(this)} submissions={this.state.submissions}
                                     mode={this.state.mode}/>
        }
        else if(this.state.mode === "viewSubmissionSummary"){
             return <StudentSubmissionSummary specificSubmissions={this.state.specificSubmissions}
                                    currentSTask={this.state.currentSubmissionTask} update={this.updateArray.bind(this)}
                                              mode={this.state.mode}
                                              submissionTasks={this.state.submissionTasks}/>
         }
        else if(this.state.mode === "viewReviewSummary"){
            return <StudentReviewSummary specificReviews={this.state.specificReviews}
                                         currentRTask={this.state.currentReviewTask}
                                         specSubmissions ={this.state.specSubmissions}
                                         specAssignments = {this.state.specAssignments}
                                         update={this.updateArray.bind(this)}
                                         mode={this.state.mode}
                                         reviewTasks={this.state.reviewTasks}/>
        }
        else{
            return <div>Home page</div>
        }

    }
    // function to get submissions of submission task clicked and set in state
    handleSubmissionTaskClick(e,element){
        let specificSubmissions = this.state.submissions.filter((item,index,array)=>{
            return item["assignment-name"] === element["task-name"];
        });
        console.log("specsss sub",specificSubmissions);
        this.setState({mode:"viewSubmissionSummary", currentSubmissionTask:element,specificSubmissions:specificSubmissions});
    }

    // Change mode to createTask when create task button is clicked
    handleCreateTaskClick(event){
        this.setState({mode:"createTask"});
    }

    // function to get reviews of review task clicked and set in state
    handleReviewTaskClick(e,element){
        let specificReviews = this.state.reviews.filter((item,index,array)=>{
            return item["assignment-name"] === element["peer-review-for"]
        });
        let specSubmissions = this.state.submissions.filter((item,index,array)=>{
            return item["assignment-name"] === element["peer-review-for"];
        });

        let specAssignments = this.state.studentAssignment.find((item,index,array)=>{
            return item["peer-review-for"] === element["peer-review-for"];
        })
        //console.log("spec sub",ppp);
        this.setState({mode:"viewReviewSummary", currentReviewTask:element, specificReviews:specificReviews,
                            specSubmissions:specSubmissions, specAssignments:specAssignments});
    }

    // Render all elements
    render(){
        let createdTasks = this.state.submissionTasks.map((element,index,array)=>{
            return <Dropdown.Item
                onClick={(e)=>this.handleSubmissionTaskClick(e,element)}
                key={`stasks${index}`}
                active={element=== this.state.currentSubmissionTask }>
                {element["task-name"]}
            </Dropdown.Item>
        });

        let createdReview = this.state.reviewTasks.map((element,index,array)=>{
            return <Dropdown.Item
                onClick={(e)=>this.handleReviewTaskClick(e,element)}
                key={`rtasks${index}`}
                active={element=== this.state.currentReviewTask }>
                {element["peer-review-for"]}
            </Dropdown.Item>
        });

       // Actual rendering of JSX elements
        return<div>
<div>

            <Menu fixed='top' fluid stackable inverted>

                    <Menu.Item as='h4'
                               header
                               position={"right"} >
                        Peer Review System
                    </Menu.Item>
                    <Menu.Item
                        as='a'
                        position={"right"}
                    >{`Welcome, ${this.props.netId}`}</Menu.Item>
                    <Menu.Item
                        as='a'
                        position={"right"}
                        margin-right={"150px"}
                        onClick ={this.props.onlogoutClick}
                    >Logout</Menu.Item>

            </Menu>
</div>



            <div style={{marginLeft:10,marginRight:10,  minWidth: 550, marginTop:50}}>
                <Grid   stackable>
                    <Grid.Column>

                    <Grid.Row >

                        <Menu fluid stackable>

                            <Dropdown item text='Submission tasks'>
                                <Dropdown.Menu>
                                    {createdTasks}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown item text='Review tasks'>
                                <Dropdown.Menu>
                                    {createdReview}
                                </Dropdown.Menu>
                            </Dropdown>

                            <Menu.Item
                                as='a'
                                position={"right"}
                                onClick = {(event)=> this.handleCreateTaskClick(event)}
                                active={this.state.mode=== "createTask"}>

                            Create task</Menu.Item>
                        </Menu>
                    </Grid.Row>
                    <Grid.Row>
                        {/*Call function to change the view for teacher */}
                        {this.handleViewComponent()}
                    </Grid.Row>
                    </Grid.Column>

                </Grid>
            </div>

        </div>

    }
}

