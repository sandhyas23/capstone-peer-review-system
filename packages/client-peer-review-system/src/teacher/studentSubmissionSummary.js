import React from 'react';
import {
    Icon,
    Grid,
    Table,
    Header,
    Segment,
    Label, Form, Input, Select,Button
} from 'semantic-ui-react';


import "react-datepicker/dist/react-datepicker.css";
import Prism from "prismjs";
import ReactCommonmark from "react-commonmark";
import DatePicker from "react-datepicker";



export default class StudentSubmissionSummary extends React.Component{
    constructor(props){
        super(props);
        this.state = {specificSubmissions:props.specificSubmissions, currentSTask:props.currentSTask, content:"",
        "task-name":props.currentSTask["task-name"], status:props.currentSTask["status"] ,
        due:new Date(props.currentSTask["due"])}

    }

    static getDerivedStateFromProps(props,state){
        if(props.currentSTask === state.currentSTask){
            return null;
        }
        else{
            return {currentSTask:props.currentSTask ,specificSubmissions:props.specificSubmissions, content:"",
                "task-name":props.currentSTask["task-name"]}
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
            {rawHtml}
        </Segment>
    }

    handleEditTask(e){
        const _this= this;
        let submissionTask = {
            type: "submission", "task-name": this.state["task-name"], status: this.state.status,
            due: this.state.due.toISOString()
        };
        fetch('/submissionTask/'+this.state.currentSTask["task-name"], {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(submissionTask)
        }).then(function (response) {
            //_this.state.submissions.push(addTask);
             _this.setState({});
           // console.log("submitted",this.state.submissions);
           // console.log(this.state.submissions);
            _this.props.update();
           // event.preventDefault();
        });
    }

    handleDeleteTask(){
        const _this= this;
        fetch('/submissionTask/'+this.state.currentSTask["task-name"], {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json"
            }
        }).then(function (response) {
            //_this.state.submissions.push(addTask);
            _this.setState({});
            // console.log("submitted",this.state.submissions);
            // console.log(this.state.submissions);
            _this.props.update();
            // event.preventDefault();
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


        return <Grid stackable>
            <Grid.Column>
                <Grid.Row>
                    <Segment style={{boxShadow:"none"}}>
                        <span><Header  textAlign={"center"} as={"h4"}>
                            <Input label={"Task-name"} size='small' icon={"pencil"} name={"task-name"}
                                   value={this.state["task-name"]}
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
                                    <Form.Field inline>
                                        <Label icon='lock open' content="Status"/>
                                        <Select placeholder='Select the status'
                                                name="status"
                                                value={this.state.status}
                                                options={[
                                                    { key: 'hw1', text: 'Open', value: 'open' },
                                                    { key: 'hw2', text: 'Closed', value: 'closed' },

                                                ]} onChange={(e,data)=> this.setState({[data.name]: data.value})}/>
                                    </Form.Field>
                                    <Button onClick={(e)=>this.handleEditTask(e)}>Save task details!</Button>
                                    <Button onClick={(e)=>this.handleDeleteTask(e)}> Delete task</Button>
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