import React from 'react';
import Prism from 'prismjs';
import ReactCommonmark from 'react-commonmark';
import submissions from '../data/submissionsHw';
import 'prismjs/themes/prism-coy.css';
import {Grid,Segment,Header,Label,Icon,Form,Input,TextArea,Button} from "semantic-ui-react";




export default class TaskSubmit extends React.Component{
    constructor(props){
        super(props);
        this.state ={currentTask: this.props.currentTask , submissions:submissions, netId: this.props.netId,
            "assignment-name":this.props.currentTask["task-name"], content:"Upload a markdown file to view the submission",
            theInputKey: "", fileName:""}
        //console.log(this.state.newTask);
    }

    static getDerivedStateFromProps(props, state){
        console.log(props,state);
        if(props.currentTask===state.currentTask){
            return null;
        }
        else {
            let task = state.submissions.find((task ,index,array) =>{

                return (task["assignment-name"] === props.currentTask["task-name"] && task["netId"] === props.netId)
            })
            if(typeof task === "undefined"){
                //console.log("inside undefined");
                //console.log("props",props ,"state",state);
                return {
                    currentTask: props.currentTask, "assignment-name": props.currentTask["task-name"],
                    content:"Upload a markdown file to view the submission",
                    fileName:""
                }
            }
            else{
                console.log("inside found result");
                return {
                    currentTask: props.currentTask, "assignment-name": props.currentTask["task-name"],
                    content:task["content"],fileName: task["fileName"]
                }
            }
        }
    }


    componentDidUpdate() {
        Prism.highlightAll();

    }
    componentDidMount() {
        Prism.highlightAll();
    }


    handleSubmit(){
        const addTask = {"assignment-name":this.state["assignment-name"] , netId:this.state.netId,
            content:this.state.content, fileName:this.state.fileName, submittedOn:new Date().toISOString()};

        let index = this.state.submissions.findIndex((task) => {
            return (task["assignment-name"] === this.state["assignment-name"] && task["netId"] === this.state.netId);
        });

        if (index >= 0 ){
            this.state.submissions.splice(index,1,addTask);
            console.log(this.state.submissions);
        }
        else{
           this.state.submissions.push(addTask);
           console.log(this.state.submissions);
        }
        let randomString = Math.random().toString(36);

        this.setState({
            theInputKey: randomString
        });
       console.log(this.state.submissions);
    }


    handleFile = async(e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = async(e)=> {
            // The file's text will be printed here

            this.setState({content:e.target.result, fileName:file.name});
            //console.log(this.state.content);
        };

        reader.readAsText(file);
    }


        render(){
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

        const markdownInstruction = this.state.content;
        const rawHtml = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>


        //console.log("rawhtml",rawHtml);
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

                                <Input readOnly style={{color:"green"}}>{this.state.currentTask["status"]}</Input>
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
                                              onChange={(event)=> this.handleChange(event)}
                                    />
                                    </Segment>
                                </Form.Field>
                                <Form.Field>
                                    <Label icon='code' content="Code Preview"/>
                                    <Segment style={{overflow: 'auto',minHeight:330,maxHeight:330,maxWidth:600,minWidth:200 }} textAlign="left">
                                            {rawHtml}
                                    </Segment>

                                </Form.Field>
                            </Form.Group>
                            <input type="file" accept=".md" onChange={ (e) => this.handleFile(e) }
                                   key={this.state.theInputKey || '' }
                            />

                            <Button icon='file' content='Submit' type={"button"} color={"green"}
                                     onClick={() =>this.handleSubmit()}/>
                        </Segment>

                    </Form>

                </Grid.Column>

            </Grid.Row>
        </Grid.Column>
        </Grid.Row>


    }
}
