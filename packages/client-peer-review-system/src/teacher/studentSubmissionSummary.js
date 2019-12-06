/*This view is rendered when teacher clicks on a task under submission tasks.
* Teacher can view all submissions posted by each student for a task and can delete any inappropriate submissions.
* Teacher can also task details like due date*/
import React from 'react';
import {
    Icon,
    Grid,
    Table,
    Header,
    Segment,
    Label, Form, Input, Select,Button,Confirm
} from 'semantic-ui-react';


import "react-datepicker/dist/react-datepicker.css";
import 'prismjs/themes/prism-coy.css';
import Prism from "prismjs";
import ReactCommonmark from "react-commonmark";
import DatePicker from "react-datepicker";
import Cookies from "universal-cookie";



export default class StudentSubmissionSummary extends React.Component{
    constructor(props){
        super(props);
        this.state = {specificSubmissions:props.specificSubmissions, currentSTask:props.currentSTask,
            content:"Click on a student ID to view their submission",
        "task-name":props.currentSTask["task-name"],open:false,isDeleted:false,
        due:new Date(props.currentSTask["due"]),
        mode:props.mode, isEdited:false,submittedOn:"",
        submissionTasks:props.submissionTasks}

    }

    //When a props is changed, a new state is returned
    static getDerivedStateFromProps(props,state){
        if(props.currentSTask === state.currentSTask){
            return null;
        }
        else{
            return {currentSTask:props.currentSTask ,specificSubmissions:props.specificSubmissions,
                content:"Click on a student ID to view their submission",
                "task-name":props.currentSTask["task-name"],
                due:new Date(props.currentSTask["due"])}
        }

    }
    componentDidUpdate() {
        Prism.highlightAll();

    }
    componentDidMount() {
        Prism.highlightAll();
    }

    // function to set the state with the submission of each student when a student id is clicked
    handleClick(event,item){
        //// console.log(item["content"]);
        this.setState({content:item["content"], "student-id":item["netId"],submittedOn:item["submittedOn"]});
    }

    // function to display the content of submission of each student with syntax highlighting
    viewContent(){
        const markdownInstruction = this.state.content;
        const rawHtml = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>
        return <Segment style={{overflow: 'auto',minHeight:500,maxHeight:330,maxWidth:1000,minWidth:200 }}>
            <Button onClick={(e)=>this.handleDeleteSubmission(e)} color={"red"}
                disabled={this.state.content==="Click on a student ID to view their submission"}>
                Delete submission</Button>
            <Label>Submitted on:{new Date(this.state.submittedOn).toLocaleString()}</Label>
            {rawHtml}
        </Segment>
    }

    // function to handle delete submission button when clicked by instructor
    handleDeleteSubmission(e)
    {
        const cookies = new Cookies();
        const gotCookie =cookies.get('user');
        if(typeof cookies.get('user') === "undefined") {
            alert("session expired");
            this.props.onclickLogout()
        }
        else {
            // let nextStudent="";
            let clickedStudentIndex = this.state.specificSubmissions.findIndex((item, index, array) => {
                return item["netId"] === this.state["student-id"];
            });
            // if(clickedStudentIndex === 0){
            //     nextStudent = this.state.specificSubmissions
            // }
            const _this = this;
            fetch('/submissions/' + this.state.currentSTask["task-name"] + '/student/' + this.state["student-id"], {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json"
                }
            }).then(function (response) {
                // console.log("inside this");
                _this.state.specificSubmissions.splice(clickedStudentIndex, 1);
                _this.setState({specificSubmissions: _this.state.specificSubmissions, content: ""});
                _this.props.update();
            })
        }
    }

    // function to handle the edit task button
    handleEditTask(e){
        const cookies = new Cookies();
        const gotCookie =cookies.get('user');
        if(typeof cookies.get('user') === "undefined") {
            alert("session expired");
            this.props.onclickLogout()
        }
        else {
            let taskIndex = this.state.submissionTasks.findIndex((item, index, arry) => {
                return item["task-name"] === this.state["task-name"];
            });
            const _this = this;
            let submissionTask = {
                type: "submission", "task-name": this.state["task-name"],
                due: this.state.due.toISOString()
            };
            fetch('/submissionTask/' + this.state.currentSTask["task-name"], {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(submissionTask)
            }).then(function (response) {
                alert("Task has been edited");
                _this.state.submissionTasks.splice(taskIndex, 1, submissionTask);
                _this.setState({isEdited: true, submissionTasks: _this.state.submissionTasks});
                _this.props.update();
            })
        }
    }


    // function to handle the delete task. Displays a confirm dialog box with cancel and yes buttons
    handleDeleteTask(){
        this.setState({ open: true })
    }
   // function to handle cancel button in the delete confirm dialog box
    handleCancel =() =>{
        this.setState({open:false})
    }

    // function to handle yes button in the delete conform dialog box
    handleConfirm = ()=>{
        const cookies = new Cookies();
        const gotCookie =cookies.get('user');
        if(typeof cookies.get('user') === "undefined") {
            alert("session expired");
            this.props.onclickLogout()
        }
        else {
            console.log("submission tasks",this.state.submissionTasks);
            let taskIndex = this.state.submissionTasks.findIndex((item, index, arry) => {
                return item["task-name"] === this.state["task-name"];
            });
            const _this = this;
            // Deleted the submission task
            fetch('/submissionTask/' + this.state.currentSTask["task-name"], {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json"
                }
            }).then(function (response) {
                _this.setState({open: false});
                _this.props.update();

            }).then(() => {
                // Deleted the submissions from the deleted submission task
                // console.log("deleteeeeee", this.state.currentSTask["task-name"]);
                fetch('/submissions/' + this.state.currentSTask["task-name"], {
                    method: 'DELETE',
                    headers: {
                        "Content-type": "application/json"
                    }
                }).then(function (response) {
                    //// console.log("inside this");
                    alert("Task has been deleted");
                    _this.state.submissionTasks.splice(taskIndex, 1);
                    _this.state.specificSubmissions = [];
                    _this.setState({
                        isDeleted: true, submissionTasks: _this.state.submissionTasks,
                        specificSubmissions: _this.state.specificSubmissions
                    });
                    //Display homepage after deletion
                    _this.props.viewHome();
                })
            });
        }

    }


// function to render all details
    render(){
     // console.log(this.state);
        // function to display all student ids that have submitted the assignment
       let students = this.state.specificSubmissions.map((item,index,array)=>{
           return <Table.Row key={`row${item["netId"]}`}><Table.Cell key={`submission${item["netId"]}`}
           onClick={(event)=>this.handleClick(event,item)} active={this.state["student-id"] === item["netId"]}>
               {item["netId"]}
           </Table.Cell>
           </Table.Row>
       })


        return <Grid stackable>
            <Grid.Column>
                <Grid.Row>
                    <Segment style={{boxShadow:"none"}}>
                        <span><Header  textAlign={"center"} as={"h4"}>
                            <Input label={"Submission Task-name"} size='small' icon={"tag"} name={"task-name"}
                                   value={this.state["task-name"]}
                                   readOnly
                                   onChange={(e)=> this.setState({"task-name":e.target.value})}/>
                        </Header>
                        </span>
                    </Segment>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Form centered={"true"}>
                            <Segment textAlign={"center"}>
                                <Form.Group centered={"true"} widths='equal'>
                                    <Form.Field inline required>
                                        <Label icon='calendar alternate' content="Due"/>
                                        <DatePicker
                                            selected={this.state.due}
                                            onChange={date => this.setState({due:date})}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="Pp"
                                        />
                                    </Form.Field>
                                    <Button onClick={(e)=>this.handleEditTask(e)}>Save task details!</Button>
                                    <Button onClick={(e)=>this.handleDeleteTask(e)}> Delete task</Button>
                                    {/*Display the confirm dialog box for delete button*/}
                                    <Confirm
                                        open={this.state.open}
                                        onCancel={this.handleCancel}
                                        onConfirm={this.handleConfirm}
                                    />
                                </Form.Group>

                            </Segment>
                        </Form>
                    </Grid.Column>

                </Grid.Row>
                <Grid.Row>
                    <Grid>
                        <Grid.Row>
                    <Grid.Column width={4}>
                        {/*Table that displays all submitter ids of an assignment*/}
                        <Table color={"blue"}>
                            <Table.Header>
                                <Table.Row>
                                <Table.HeaderCell>Student Ids submitted</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {/*Display all the students that have submitted the assignment*/}
                                {students}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        {/*Display the content submitted by each student*/}
                        {this.viewContent()}
                    </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Row>
            </Grid.Column>

        </Grid>
    }
}