import React from 'react';
import Prism from 'prismjs';
import ReactCommonmark from 'react-commonmark';
import submissions from './submissionsHw';
import 'prismjs/themes/prism-coy.css';
import {Grid,Image,Segment,Header,Label,Icon,Form,Container,Input,TextArea,Button} from "semantic-ui-react";


export default class TaskSubmit extends React.Component{
    constructor(props){
        super(props);
        this.state ={currentTask: this.props.currentTask , submissions:submissions, netId: this.props.netId,
            taskName:this.props.currentTask["task-name"],newTask:{taskName:props.currentTask["task-name"] ,
                netId: props.netId, instruction:""}

        }
        //console.log(this.state.newTask);
    }

    static getDerivedStateFromProps(props, state){
        //console.log(props,state);
        if(props.currentTask===state.currentTask){
            return null;
        }
        else{
            let task = state.submissions.find((tas , index, array) => {
                // console.log(tas["task-name"]);
                return (tas.taskName === state.taskName && tas.netId === state.netId);
            })
            if(typeof task ==="undefined"){
                console.log("handled undesfined");
                return {currentTask: props.currentTask,taskName: props.currentTask["task-name"],
                    newTask:{taskName:props.currentTask["task-name"] , netId: props.netId,
                        instruction:""}
                }
            }
            else{
                return {currentTask: props.currentTask,taskName: props.currentTask["task-name"],
                    newTask:{taskName:props.currentTask["task-name"] , netId: props.netId,
                        instruction:task.instruction}
                }
            }
        }
    }

    componentDidUpdate() {
        Prism.highlightAll();
        let task = this.state.submissions.find((tas , index, array) => {
           // console.log(tas["task-name"]);
            return (tas.taskName === this.state.taskName);
        })
        if(typeof task ==="undefined"){
            console.log("handled undesfined");
        }
        else{
            console.log("componentdidupdate" + task.instruction);

        }

        // this.setState({
        //     newTask:{instruction: this.state.submissions.currentTask["instructions"]}
        // })

    }
    componentDidMount() {
        Prism.highlightAll();
    }

    handleChange(event) {

       // console.log("newtask" +this.state.newTask["instruction"]);
        let task = Object.assign({}, this.state.newTask);    //creating copy of object
        task[event.target.name] = event.target.value;                        //updating value
        this.setState({ newTask:task });
        console.log("task"+task["instruction"]);
        console.log("newtask" +this.state.newTask["instruction"]);


        // const target = event.target;
        // const value = target.value;
        // const name = target.name;
        //
        // this.setState({ newTask:{instruction:value} });
        // console.log("newtask" +this.state.newTask["instruction"]);
    }

    handleSubmit(){
        let addTask = {taskName: this.state.taskName, netId: this.props.netId, instruction: this.state.instruction,
        stat:"submitted"};
        this.state.submissions.push(addTask);
       //console.log(this.state.submissions);
    }
    handleSave(){
        this.setState({newTask:{stat:"saved"}});
        this.state.submissions.push(this.state.newTask);
        console.log(this.state.submissions);
    }

        render(){
        const markdownInstruction = this.state.newTask["instruction"];
        const rawHtml =<div id="rawHtml" className="language-html">

            <ReactCommonmark source={markdownInstruction} />

        </div>


        return <Grid.Column  computer={15} tablet={10}>
            <Grid.Row>
                <Grid.Column>
                    <Segment style={{boxShadow:"none"}}>
                        <Header textAlign={"center"} as={"h4"}><Icon name='tag'/>
                            {this.state.currentTask["task-name"]}
                        </Header>
                    </Segment>
                </Grid.Column>
            </Grid.Row>



            <Grid.Row centered={"true"}>

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
                                    <Label icon='keyboard' content="Instruction"/>
                                    <Segment>
                                    <TextArea style={{ minHeight: 400 }}
                                              name={"instruction"}
                                              value={this.state.newTask["instruction"]}
                                              onChange={(event)=> this.handleChange(event)}
                                    />
                                    </Segment>
                                </Form.Field>
                                <Form.Field>
                                    <Label icon='code' content="Preview"/>
                                    <Segment style={{minHeight:430}} textAlign="left">
                                            {rawHtml}
                                    </Segment>

                                </Form.Field>
                            </Form.Group>
                            <Button icon='save' content='Save'  type={"button"} color={"blue"} onClick={() => this.handleSave()}/>
                            <Button icon='file' content='Submit' type={"button"} color={"green"} onClick={() =>this.handleSubmit()}/>
                        </Segment>
                    </Form>

                </Grid.Column>
            </Grid.Row>
        </Grid.Column>



    }
}
