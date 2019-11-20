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
import TeacherView from "./teacherView";



export default class StudentSubmissionSummary extends React.Component{
    constructor(props){
        super(props);
        this.state = {specificSubmissions:props.specificSubmissions, currentSTask:props.currentSTask,
            content:"Click on a student ID to view their submission",
        "task-name":props.currentSTask["task-name"],open:false,isDeleted:false,
        due:new Date(props.currentSTask["due"]),
        mode:props.mode,
        submissionTasks:props.submissionTasks}

    }

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

    handleClick(event,item){
        //console.log(item["content"]);
        this.setState({content:item["content"], "student-id":item["netId"]});
    }
    viewContent(){
        const markdownInstruction = this.state.content;
        const rawHtml = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>
        return <Segment style={{overflow: 'auto',minHeight:500,maxHeight:330,maxWidth:1000,minWidth:200 }}>
            <Button onClick={(e)=>this.handleDeleteSubmission(e)}
                disabled={this.state.content==="Click on a student ID to view their submission"}>
                Delete submission</Button>
            {rawHtml}
        </Segment>
    }

    handleDeleteSubmission(e)
    {
        // let nextStudent="";
        let clickedStudentIndex = this.state.specificSubmissions.findIndex((item,index,array)=>{
                  return item["netId"] === this.state["student-id"];
         });
        // if(clickedStudentIndex === 0){
        //     nextStudent = this.state.specificSubmissions
        // }
        const _this=this;
        fetch('/submissions/'+this.state.currentSTask["task-name"]+'/student/'+this.state["student-id"], {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json"
            }
        }).then(function (response) {
            console.log("inside this");
            _this.state.specificSubmissions.splice(clickedStudentIndex,1);
            _this.setState({specificSubmissions:_this.state.specificSubmissions, content:""});
            _this.props.update();
        })
    }

    handleEditTask(e){
        const _this= this;
        let submissionTask = {
            type: "submission", "task-name": this.state["task-name"],
            due: this.state.due.toISOString()
        };
        fetch('/submissionTask/'+this.state.currentSTask["task-name"], {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(submissionTask)
        }).then(function (response) {
            _this.setState({});
            _this.props.update();
        })
    }

    // show = async () => this.setState({ open: true })

    handleDeleteTask(){
        this.setState({ open: true })
    }

    handleCancel =() =>{
        this.setState({open:false})
    }

    handleConfirm = ()=>{
        let taskIndex = this.state.submissionTasks.findIndex((item,index,arry)=>{
            return item["task-name"] === this.state["task-name"];
        });
        const _this= this;
        fetch('/submissionTask/'+this.state.currentSTask["task-name"], {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json"
            }
        }).then(function (response) {
            _this.setState({open:false});
            _this.props.update();

        }).then(()=>{
            fetch('/submissions/'+this.state.currentSTask["task-name"], {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json"
                }
            }).then(function (response) {
                console.log("inside this");
                _this.state.submissionTasks.splice(taskIndex,1);
                _this.setState({isDeleted:true,submissionTasks:_this.state.submissionTasks});
                _this.props.update();
            })
        });

    }



    render(){
       let students = this.state.specificSubmissions.map((item,index,array)=>{
           return <Table.Row key={`row${item["netId"]}`}><Table.Cell key={`submission${item["netId"]}`}
           onClick={(event)=>this.handleClick(event,item)} active={this.state["student-id"] === item["netId"]}>
               {item["netId"]}
           </Table.Cell>
           </Table.Row>
       })

        if(this.state.isDeleted){
            return <div>Home page</div>
        }


        return <Grid stackable>
            <Grid.Column>
                <Grid.Row>
                    <Segment style={{boxShadow:"none"}}>
                        <span><Header  textAlign={"center"} as={"h4"}>
                            <Input label={"Submission Task-name"} size='small' icon={"pencil"} name={"task-name"}
                                   value={this.state["task-name"]}
                                   disabled={this.state.specificSubmissions.length >0}
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
                                    <Form.Field inline>
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
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                <Table.HeaderCell>Student Ids submitted</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {students}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        {this.viewContent()}

                    </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Row>
            </Grid.Column>

        </Grid>
    }
}