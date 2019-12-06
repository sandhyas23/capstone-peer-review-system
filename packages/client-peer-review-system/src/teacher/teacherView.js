/*Basic view for teacher or instructor
* This is rendered when a user is logged in as a teacher
* */

import React from 'react';
import {
    Menu,
    Grid,
    Dropdown, Icon, Segment, Header,

} from 'semantic-ui-react';
//import createdSubmissionTasks from '../data/createdSubmissionTasks';
//import createdReviewTasks from '../data/createdReviewTasks'
import Prism from "prismjs";
import CreateReviewTask from "./createReviewTask";
import StudentSubmissionSummary from "./studentSubmissionSummary";
//import submissionsHW from '../data/submissionsHw';
//import reviews from '../data/reviewTasksStudents';
import StudentReviewSummary from './studentReviewSummary';
import Cookies from "universal-cookie";


export default class TeacherView extends React.Component{
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {submissionTasks:[] ,reviewTasks:[], mode:"",
        submissions:[],reviews:[], specificSubmissions:[], currentSubmissionTask:"",specificReviews:[],
        currentReviewTask:"", studentAssignment:[],specAssignments:[]}
    }


    componentDidUpdate(prevProps, prevState) {

        // console.log("teacher view updated");
        // console.log("prevState sub", prevState["submissionTasks"] === this.state["submissionTasks"]);
        // console.log("prevState rev", prevState["reviewTasks"] , this.state["reviewTasks"]);
        //// console.log("nowstate", this.state["submissionTasks"]);
        if(prevState["specificSubmissions"] !== this.state["specificSubmissions"]) {
            const _this = this;
            fetch('/submissions/', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(response => response.json()).then(function (data) {

                //// console.log("this is what we got in submissions" + data.submissions);
                //_this.state.submissions.push(data.submission);
                _this.setState({"submissions": data.submissions});


            });
        }

        else if(prevState["specificReviews"] !== this.state["specificReviews"]) {
                const _this = this;
                fetch('/reviews/', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }).then(response => response.json()).then(function (data) {
                        fetch('/studentAssignment/',{
                            method: "GET",
                            headers : {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            }
                        }).then(response => response.json()).then(function(data) {

                            // console.log("this is what we got in stu ass" +data.studentAssignment);
                            //_this.state.submissions.push(data.submission);
                            _this.setState({"studentAssignment": data.studentAssignment});


                        });

                    //// console.log("this is what we got in reviews" + data.reviews);
                    //_this.state.submissions.push(data.submission);
                    _this.setState({"reviews": data.reviews});


                });

        }
        //
        // else if(prevState["currentSubmissionTask"] !== this.state["currentSubmissionTask"]) {
        //     const _this = this;
        //     fetch('/submissionTask', {
        //         method: "GET",
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Accept': 'application/json'
        //         }
        //     }).then(response => response.json()).then(function (data) {
        //
        //         //// console.log("this is what we got in sub tasks" +data);
        //         _this.setState({submissionTasks: data.submissionTasks});
        //
        //     });
        // }
        // else if(prevState["currentReviewTask"] !== this.state["currentReviewTask"]) {
        //         const _this = this;
        //         fetch('/reviewTask',{
        //             method: "GET",
        //             headers : {
        //                 'Content-Type': 'application/json',
        //                 'Accept': 'application/json'
        //             }
        //         }).then(response => response.json()).then(function(data) {
        //             fetch('/studentAssignment/',{
        //                 method: "GET",
        //                 headers : {
        //                     'Content-Type': 'application/json',
        //                     'Accept': 'application/json'
        //                 }
        //             }).then(response => response.json()).then(function(data) {
        //
        //                 // console.log("this is what we got in stu ass" +data.studentAssignment);
        //                 //_this.state.submissions.push(data.submission);
        //                 _this.setState({"studentAssignment": data.studentAssignment});
        //
        //
        //             });
        //
        //             //// console.log("this is what we got in sub tasks" +data);
        //             _this.setState({reviewTasks: data.reviewTasks});
        //
        //         });
        //
        // }

        Prism.highlightAll();

    }

    // Get all submission tasks, submissions, reviews and review tasks when component is mounted
    componentDidMount() {
        this._isMounted = true;
        let _this = this;
        fetch('/submissionTask',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            // console.log("this is what we got" +data);
            _this.setState({submissionTasks: data.submissionTasks});

        });

        fetch('/submissions/',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            // console.log("this is what we got in task submit" +data.submissions);
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

            // console.log("this is what we got" +data);
            _this.setState({reviewTasks: data.reviewTasks});

        });
        fetch('/reviews/',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            // console.log("this is what we got in task submit" +data.reviews);
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

            // console.log("this is what we got in stu ass" +data.studentAssignment);
            //_this.state.submissions.push(data.submission);
            _this.setState({"studentAssignment": data.studentAssignment});


        });
        Prism.highlightAll();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    updateArray() {
        this.setState({ submissionTasks: this.state.submissionTasks });
    }


    // Display different view components for teacher based on user click
    handleViewComponent(){
        if(this.state.mode === "createTask"){
            const cookies = new Cookies();
           // const gotCookie =cookies.get('user');
            if(typeof cookies.get('user') === "undefined") {
                this.props.onlogoutClick()
            }

            return <CreateReviewTask submissionTasks={this.state.submissionTasks} reviewTasks={this.state.reviewTasks}
                                     update={this.updateArray.bind(this)} submissions={this.state.submissions}
                                     mode={this.state.mode}
                                     viewHome={()=>this.handleHomeClick()}
                                     onclickLogout= {()=>this.props.onlogoutClick()}
                                     />
        }
        else if(this.state.mode === "viewSubmissionSummary"){

             return <StudentSubmissionSummary specificSubmissions={this.state.specificSubmissions}
                                              currentSTask={this.state.currentSubmissionTask}
                                              update={this.updateArray.bind(this)}
                                              mode={this.state.mode}
                                              submissionTasks={this.state.submissionTasks}
                                              viewHome={()=>this.handleHomeClick()}
                                              onclickLogout= {()=>this.props.onlogoutClick()}/>
         }
        else if(this.state.mode === "viewReviewSummary"){
            return <StudentReviewSummary specificReviews={this.state.specificReviews}
                                         currentRTask={this.state.currentReviewTask}
                                         specSubmissions ={this.state.specSubmissions}
                                         specAssignments = {this.state.specAssignments}
                                         update={this.updateArray.bind(this)}
                                         mode={this.state.mode}
                                         reviewTasks={this.state.reviewTasks}
                                         viewHome={()=>this.handleHomeClick()}
                                         onclickLogout= {()=>this.props.onlogoutClick()}/>
        }
        else{
            // in homepage, display the tasks to complete both, submission and review
            let createdTasks = this.state.submissionTasks.map((element,index,array)=>{
                return <Menu.Item
                    onClick={(e)=>this.handleSubmissionTaskClick(e,element)}
                    key={`sstasks${index}`}
                    active={element=== this.state.currentSubmissionTask }>
                    {element["task-name"]}
                </Menu.Item>
            });

            let createdReview = this.state.reviewTasks.map((element,index,array)=>{
                return <Menu.Item
                    onClick={(e)=>this.handleReviewTaskClick(e,element)}
                    key={`rrtasks${index}`}
                    active={element=== this.state.currentReviewTask }>
                    {element["peer-review-for"]}
                </Menu.Item>
            });

            return <div><Segment placeholder
                                 style={{overflow: 'auto',minHeight:230,maxHeight:330,minWidth:200,
                                 marginLeft:"10em", marginTop:"3em", marginRight:"10em"}}>
                <Header>
                    <Icon name='tasks' circular inverted color={"blue"}/>
                    <Header.Content>You have the created the following assignments to submit.
                        Click on each to view progress.</Header.Content>
                </Header>
                <Menu>
                    {createdTasks}
                </Menu>
            </Segment>
                <Segment placeholder
                         style={{overflow: 'auto',minHeight:230,maxHeight:330,minWidth:200,
                             marginLeft:"10em", marginTop:"3em", marginRight:"10em"}}>
                    <Header>
                        <Icon name='tasks' circular inverted color={"blue"}/>
                        <Header.Content>You have created the following review tasks to submit.
                            Click on each to view progress. </Header.Content>
                    </Header>
                    <Menu>
                        {createdReview}
                    </Menu>
                </Segment>

            </div>
        }

    }
    // function to get submissions of submission task clicked and set in state
    handleSubmissionTaskClick(e,element){
        const cookies = new Cookies();
        // const gotCookie =cookies.get('user');
        if(typeof cookies.get('user') === "undefined") {
            this.props.onlogoutClick()
        }
        else {

            let specificSubmissions = this.state.submissions.filter((item, index, array) => {
                return item["assignment-name"] === element["task-name"];
            });
            // console.log("specsss sub", specificSubmissions);
            this.setState({
                mode: "viewSubmissionSummary",
                currentSubmissionTask: element,
                specificSubmissions: specificSubmissions
            });
        }
    }

    // Change mode to createTask when create task button is clicked
    handleCreateTaskClick(event){
        const cookies = new Cookies();
        // const gotCookie =cookies.get('user');
        if(typeof cookies.get('user') === "undefined") {
            this.props.onlogoutClick()
        }
        else {
            this.setState({mode: "createTask"});
        }
    }

    // function to get reviews of review task clicked and set in state
    handleReviewTaskClick(e,element){
        const cookies = new Cookies();
        // const gotCookie =cookies.get('user');
        if(typeof cookies.get('user') === "undefined") {
            this.props.onlogoutClick()
        }
        else {
            let specificReviews = this.state.reviews.filter((item, index, array) => {
                return item["assignment-name"] === element["peer-review-for"]
            });
            let specSubmissions = this.state.submissions.filter((item, index, array) => {
                return item["assignment-name"] === element["peer-review-for"];
            });

            let specAssignments = this.state.studentAssignment.find((item, index, array) => {
                return item["peer-review-for"] === element["peer-review-for"];
            })
            //// console.log("spec sub",ppp);
            this.setState({
                mode: "viewReviewSummary", currentReviewTask: element, specificReviews: specificReviews,
                specSubmissions: specSubmissions, specAssignments: specAssignments
            });
        }
    }

    handleHomeClick() {
        let _this = this;
        fetch('/submissionTask',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            // console.log("this is what we got" +data);
            _this.setState({submissionTasks: data.submissionTasks});

        });

        fetch('/reviewTask',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            // console.log("this is what we got" +data);
            _this.setState({reviewTasks: data.reviewTasks});

        });
        fetch('/studentAssignment/',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            //// console.log("this is what we got in stu assi" +data.studentAssignment);
            //_this.state.submissions.push(data.submission);
            _this.setState({"studentAssignment": data.studentAssignment});


        });

        this.setState({mode: "", currentSubmissionTask: "", currentReviewTask: ""
        });
    }

    // Render all elements
    render(){
        //// console.log("state teacher view", this.state);
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
                               position={"right"}
                    onClick={()=>this.handleHomeClick()}>
                        <Icon name={"home"} />
                        Peer Review System
                    </Menu.Item>
                    <Menu.Item
                        as='a'
                        position={"right"}
                    >{`Welcome, ${this.props.netId} -- Instructor`} </Menu.Item>
                    <Menu.Item
                        as='a'
                        position={"right"}
                        margin-right={"150px"}
                        onClick ={this.props.onlogoutClick}
                    >
                        <Icon name={"sign-out"} />Logout</Menu.Item>

            </Menu>
</div>



            <div style={{marginLeft:10,marginRight:10,  minWidth: 550, marginTop:50}}>
                <Grid   stackable>
                    <Grid.Column>

                    <Grid.Row >

                        <Menu fluid stackable >

                            <Dropdown button color={"teal"} text='Submission tasks' labeled className='icon' floating  icon='tasks'>
                                <Dropdown.Menu>
                                    {createdTasks}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown button text='Review tasks' labeled className='icon' floating  icon='tasks'>
                                <Dropdown.Menu>
                                    {createdReview}
                                </Dropdown.Menu>
                            </Dropdown>

                            <Menu.Item
                                as='a'
                                position={"right"}
                                onClick = {(event)=> this.handleCreateTaskClick(event)}
                                active={this.state.mode=== "createTask"}
                                color={"blue"}>
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

