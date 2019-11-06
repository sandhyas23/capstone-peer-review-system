import React from 'react';
import {
    Menu,
    Grid,
    Dropdown,

} from 'semantic-ui-react';
import createdSubmissionTasks from '../data/createdSubmissionTasks';
import createdReviewTasks from '../data/createdReviewTasks'
import Prism from "prismjs";
import CreateReviewTask from "./createReviewTask";
import StudentSubmissionSummary from "./studentSubmissionSummary";
import submissionsHW from '../data/submissionsHw';
import reviews from '../data/reviewTasksStudents';
import StudentReviewSummary from './studentReviewSummary';


export default class TeacherView extends React.Component{
    constructor(props){
        super(props);
        this.state = {submissionTasks:createdSubmissionTasks ,reviewTasks:createdReviewTasks, mode:"",
        submissions:submissionsHW,reviews:reviews, specificSubmissions:[], currentSubmissionTask:"",specificReview:[],
        currentReviewTask:""}

    }


    componentDidUpdate() {
        Prism.highlightAll();

    }
    componentDidMount() {
        Prism.highlightAll();
    }



    handleViewComponent(){
        if(this.state.mode === "createTask"){
            return <CreateReviewTask submissionTasks={this.state.submissionTasks} reviewTasks={this.state.reviewTasks} />
        }
        else if(this.state.mode === "viewSubmissionSummary"){
             return <StudentSubmissionSummary specificSubmissions={this.state.specificSubmissions}
                                    currentSTask={this.state.currentSubmissionTask}/>
         }
        else if(this.state.mode === "viewReviewSummary"){
            return <StudentReviewSummary specificReviews={this.state.specificReviews}
                                         currentRTask={this.state.currentReviewTask}
                                         specSubmissions ={this.state.specSubmissions}/>
        }
        else{
            return <div>You are not authorized to view this!</div>
        }

    }

    handleSubmissionTaskClick(e,element){
        let specificSubmissions = this.state.submissions.filter((item,index,array)=>{
            return item["assignment-name"] === element["task-name"];
        });
        console.log("specsss sub",specificSubmissions);
        this.setState({mode:"viewSubmissionSummary", currentSubmissionTask:element,specificSubmissions:specificSubmissions});
    }

    handleCreateTaskClick(event){
        this.setState({mode:"createTask"});
    }
    handleReviewTaskClick(e,element){
        let specificReviews = this.state.reviews.filter((item,index,array)=>{
            return item["assignment-name"] === element["peer-review-for"]
        });
        let specSubmissions = this.state.submissions.filter((item,index,array)=>{
            return item["assignment-name"] === element["peer-review-for"];
        });
        //console.log("spec sub",ppp);
        this.setState({mode:"viewReviewSummary", currentReviewTask:element, specificReviews:specificReviews,
                            specSubmissions:specSubmissions});
    }


    render(){
        let createdTasks = this.state.submissionTasks.map((element,index,array)=>{
            return <Dropdown.Item onClick={(e)=>this.handleSubmissionTaskClick(e,element)} key={`stasks${index}`} >
                {element["task-name"]}
            </Dropdown.Item>
        });

        let createdReview = this.state.reviewTasks.map((element,index,array)=>{
            return <Dropdown.Item onClick={(e)=>this.handleReviewTaskClick(e,element)} key={`rtasks${index}`} >
                {element["peer-review-for"]}
            </Dropdown.Item>
        });


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

                            >Create task</Menu.Item>
                        </Menu>
                       {/* <Menu fluid stackable >
                                <Menu.Item header>Tasks created</Menu.Item>
                                <Menu.Menu>
                                    {createdTasks}
                                </Menu.Menu>
                                <Menu.Item
                                    as='a'
                                    position={"right"}
                                    onClick = {(event)=> this.handleCreateTaskClick(event)}

                                >Create task</Menu.Item>

                        </Menu>*/}
                    </Grid.Row>
                    <Grid.Row>
                        {this.handleViewComponent()}
                    </Grid.Row>
                    </Grid.Column>

                </Grid>
            </div>

        </div>

    }
}

