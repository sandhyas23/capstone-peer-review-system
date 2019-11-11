import React from 'react';
import Prism from 'prismjs';
import ReactCommonmark from 'react-commonmark';
import submissions from '../data/submissionsHw';
import 'prismjs/themes/prism-coy.css';
import {Grid,Segment,Header,Label,Icon,Form,Input,TextArea,Button} from "semantic-ui-react";


export default class ViewSubmission extends React.Component{
    constructor(props){
        super(props);
        this.state ={currentTask: this.props.currentTask , submissions:props.submissions, netId: this.props.netId,
            "assignment-name":this.props.currentTask["task-name"]}
        //console.log(this.state.newTask);
    }

    static getDerivedStateFromProps(props,state){
        if(props.currentTask == state.currentTask){
            return null;
        }
        else{
            return {
                currentTask: props.currentTask , submissions:props.submissions,
                "assignment-name":props.currentTask["task-name"],
            }
        }
    }
    componentDidUpdate() {
        Prism.highlightAll();

    }
    componentDidMount() {
        Prism.highlightAll();
    }


    render(){
        let content="", fileName=""
        let mySubmission =  this.state.submissions.find((item,index,array)=>{
            return item["netId"] == this.state.netId && item["assignment-name"]== this.state["assignment-name"]
        });
        if(typeof mySubmission !== "undefined"){
             content = mySubmission["content"];
             fileName = mySubmission["fileName"];
        }


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

        const markdownInstruction = content;
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
                                            Filename : {fileName}
                                        </Label>
                                        <Segment style={{overflow: 'auto',minHeight:330,maxHeight:330,maxWidth:600,minWidth:200 }} >

                                            <TextArea readOnly style={{ minHeight: 300, minWidth:200, }}
                                                      name={"content"}
                                                      value={content}
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

                            </Segment>

                        </Form>

                    </Grid.Column>

                </Grid.Row>
            </Grid.Column>
        </Grid.Row>


    }
}
