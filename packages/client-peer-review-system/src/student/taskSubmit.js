/*This component is rendered when a student clicks a task to
upload a submission for an assigment*/

import React from 'react';
import Prism from 'prismjs';
import ReactCommonmark from 'react-commonmark';
//import submissions from '../data/submissionsHw';
import 'prismjs/themes/prism-coy.css';
import {Grid,Segment,Header,Label,Icon,Form,Input,TextArea,Button} from "semantic-ui-react";
import Cookies from "universal-cookie";




export default class TaskSubmit extends React.Component{
    constructor(props){
        super(props);
        this.state ={currentTask: this.props.currentTask , submissions:[], netId: this.props.netId,
            "assignment-name":this.props.currentTask["task-name"], content:"Upload a markdown file to view the submission",
            theInputKey: "", fileName:""}
        //// console.log(this.state.newTask);
    }

    // called when a prop changed to return a new state
    static getDerivedStateFromProps(props, state){
        //// console.log(props,state);
        if(props.currentTask === state.currentTask){
            return null;
        }
        else {
           // find if the student has already submitted an assignment.
            // Get the content and set the state
            let studentSubmission = state.submissions.find((element,index,array)=>{
                return element["assignment-name"] === props.currentTask["task-name"];
            });
            //// console.log("cc",studentSubmission);

                if (typeof studentSubmission !== "undefined") {
                    let randomString = Math.random().toString(36);

                    let content = studentSubmission.content;
                    let fileName = studentSubmission.fileName;
                    //_this.setState({"submissions": _this.state.submissions, "content": content});
                    return {
                        currentTask: props.currentTask, "assignment-name": props.currentTask["task-name"],
                        content: content,
                        fileName: fileName,
                        theInputKey: randomString
                    }
                } else {
                    let randomString = Math.random().toString(36);

                    return {

                        currentTask: props.currentTask, "assignment-name": props.currentTask["task-name"],
                        content: "Upload a markdown file to view the submission",
                        fileName: "",
                        theInputKey: randomString
                    }
                }
            }
    }


    componentDidUpdate() {
        Prism.highlightAll();

    }

    // Get the submissions of a particular student and set in state to display initially
    componentDidMount() {
        let _this = this;
        fetch('/submissions/student/'+this.state.netId,{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {

            let studentSubmission = data.submissions.find((element,index,array)=>{
                return element["assignment-name"] === _this.state.currentTask["task-name"];
            })

            //// console.log("this is what we got in task submit" +data.submissions);
            //_this.state.submissions.push(data.submission);
            if(typeof studentSubmission !== "undefined"){
                _this.setState({"submissions": data.submissions,"content":studentSubmission["content"],
                    "fileName":studentSubmission["fileName"]});

            }
            else{
                _this.setState({"submissions":data.submissions});
            }

        });


        Prism.highlightAll();
    }


    // function to handle submit button when clicked
    handleSubmit() {
        const cookies = new Cookies();
        //const gotCookie =cookies.get('user');
        if (typeof cookies.get('user') === "undefined") {
            alert("session expired");
            this.props.onclickLogout()
        } else {
            const _this = this;
            const addTask = {
                "assignment-name": this.state["assignment-name"], netId: this.state.netId,
                content: this.state.content, fileName: this.state.fileName, submittedOn: new Date().toISOString()
            };

            // if already submitted, replace the submission
            let index = this.state.submissions.findIndex((task) => {
                return (task["assignment-name"] === this.state["assignment-name"] && task["netId"] === this.state.netId);
            });

            if (index >= 0) {
                fetch('/submissions/' + this.state["assignment-name"] + '/student/' + this.state.netId, {
                    method: 'PUT',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(addTask)
                }).then(function (response) {
                    _this.state.submissions.splice(index, 1, addTask);
                    _this.setState({
                        submissions: _this.state.submissions
                    });
                    //// console.log("submitted",this.state.submissions);
                    //_this.props.update();
                    //event.preventDefault();
                });

            }
            // if not submiited, add a new submission
            else {
                fetch('/submissions/' + this.state["assignment-name"] + '/student/' + this.state.netId, {
                    method: 'PUT',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(addTask)
                }).then(function (response) {
                    _this.state.submissions.push(addTask);
                    let randomString = Math.random().toString(36);
                    // reset the filename to null
                    _this.setState({
                        submissions: _this.state.submissions,
                        theInputKey: randomString

                    });
                    //// console.log("submitted",this.state.submissions);
                    //// console.log(this.state.submissions);
                    // _this.props.update();
                    //event.preventDefault();
                });
            }
            //// console.log(this.state.submissions);
        }
    }

// handle the upload button when clicked. Read the markdown file and save it in the state
    handleFile = async(e) => {

        let reader = new FileReader();
        let file = e.target.files[0];

        if (e.target.value.length !== 0) {
            reader.onloadend = async (e) => {
                // The file's text will be printed here

                this.setState({content: e.target.result, fileName: file.name});
                //// console.log(this.state.content);
            };

            reader.readAsText(file);
        }
        else{
            this.setState({content: this.state.content, fileName: this.state.fileName});
        }
    }



        render(){
        // console.log("state", this.state);

        // Get the submission time
        let submissionStatus ="";
        let submittedDate ="";
        let taskSubmitted = this.state.submissions.find((task,index,array) => {
            return (task["assignment-name"] === this.state["assignment-name"] && task["netId"] === this.state.netId);
            });
        if(typeof taskSubmitted === "undefined"){
             submissionStatus = "Not Submitted";
        }
        else{
             submissionStatus = "Submitted";
             submittedDate = new Date(taskSubmitted["submittedOn"]).toLocaleString();
        }

        // Convert the markdown submission to highlighted syntax to display preview
        const markdownInstruction = this.state.content;
        const rawHtml = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>


        //// console.log("rawhtml",rawHtml);
            // Display details in page grid view
        return<Grid.Row>
           <Grid.Column computer={14}>
            <Grid.Row>

                    <Segment style={{boxShadow:"none"}}>

                        <Label ribbon icon='star' content={`${submissionStatus} : ${submittedDate}`} color="blue"/>
                        <span><Header  textAlign={"center"} as={"h4"}>
                            <Icon name='tag'/>
                            {this.state.currentTask["task-name"]}
                        </Header>
                        </span>

                    </Segment>

            </Grid.Row>

            <Grid.Row >

                <Grid.Column>
                    <Form centered={"true"}>
                        <Segment textAlign={"center"}>
                        <Form.Group centered={"true"} widths='equal'>
                            <Form.Field inline >
                                <Label icon='calendar alternate' content="Due"/>
                                <Input readOnly>{new Date(this.state.currentTask["due"]).toLocaleString()}</Input>
                            </Form.Field>
                            <Form.Field inline>
                                <Label icon='lock open' content="Status"/>

                                <Input readOnly style={{color:"green"}}>Open</Input>
                            </Form.Field>
                        </Form.Group>
                            <Form.Group centered={"true"} widths='equal'>
                                <Form.Field>
                                    <Label icon='file code' content="Markdown Preview "/>
                                    <Label basic>
                                        <Icon name={'file'}/>
                                        Filename : {this.state.fileName}
                                    </Label>
                                    <Segment style={{overflow: 'auto',minHeight:330,maxHeight:330,maxWidth:600,minWidth:200 }} >

                                    <TextArea readOnly style={{ minHeight: 300, minWidth:200, }}
                                              name={"content"}
                                              value={this.state.content}
                                              // onChange={(event)=> this.handleChange(event)}
                                    />
                                    </Segment>
                                </Form.Field>
                                <Form.Field>
                                    <Label icon='code' content="Code Preview"/>
                                    <Segment style={{overflow: 'auto',minHeight:330,maxHeight:330,maxWidth:600,minWidth:200 }}
                                             textAlign="left">
                                            {rawHtml}
                                    </Segment>

                                </Form.Field>
                            </Form.Group>
                            <input type="file" accept=".md" onChange={ (e) => this.handleFile(e) }
                                   key={this.state.theInputKey}
                            />

                            <Button icon='file' content='Submit' type={"button"} color={"green"}
                                     onClick={() =>this.handleSubmit()}
                            disabled={this.state.content === "Upload a markdown file to view the submission"}/>
                        </Segment>

                    </Form>

                </Grid.Column>

            </Grid.Row>
        </Grid.Column>
        </Grid.Row>


    }
}
