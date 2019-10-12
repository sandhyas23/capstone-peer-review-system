import React from 'react';
import {Button, Form, Grid, Header, Icon, Input, Label, Segment, TextArea,Menu} from "semantic-ui-react";
import studentsReview from "./reviewTasksStudents";
import 'prismjs/themes/prism-coy.css';
import Prism from "prismjs";
import ReactCommonmark from "react-commonmark";



export default class TaskReview extends React.Component{
    constructor(props){
        super(props);
        this.state ={currentTask: this.props.currentTask , studentsReview:studentsReview, netId: this.props.netId,
            taskName:this.props.currentTask["task-name"],instruction:"Click a review link to view the submission",
            totalQuestions:[], reviewId:"",
            theInputKey: "", fileName:""}
            //console.log(this.state);
    }

    static getDerivedStateFromProps(props,state){
        if(props === state){
            return null;
        }
        else {
            let task = state.studentsReview.find((task ,index,array) =>{

                return (task["task"] === props.currentTask["task-name"] && task["netId"] === props.netId)
            })
            if(typeof task === "undefined"){
                console.log("inside undefined");
                //console.log("props",props ,"state",state);
                return {
                    currentTask: props.currentTask, taskName: props.currentTask["task-name"],
                    instruction:"Click a review link to view the submission",totalQuestions:[], reviewId:"",
                    fileName:""
                }
            }
            else{

                console.log("inside found result");
                return {
                    currentTask: props.currentTask, taskName: props.currentTask["task-name"],

                }
            }
        }

    }
    handleItemClick(event, review){

        let questionsLength = review["questions"].length;
        console.log("instruction when clicked",review["instruction"]);
        let questions=[];
        this.setState({instruction:review["instruction"], totalQuestions:review["questions"],
            reviewId:review["id"]
        });
        //console.log("questions", this.state.questions);
    }

    handleChange(e){

        const target = e.target;
        const value = target.value;
        const name = target.name;
       // console.log("event:",e, "target",target);


        this.setState({
            [name]:value
        });


    }

    handleSubmit(event){
       let reviewToPost = this.state.studentsReview.find((element,index,array)=>{
           return (element["task"] === this.state.taskName && element["netId"] === this.state.netId);
       });
        //console.log("length", reviewToPost["tasksToReview"]);
       if(typeof reviewToPost != "undefined"){

           let questions = reviewToPost["tasksToReview"][this.state.reviewId]["questions"];
           //console.log("questions",questions);
           for(let i=0;i<questions.length;i++){
               questions[i].points=this.state[`point${this.state.reviewId}${i}`];
               questions[i].comments=this.state[`comment${this.state.reviewId}${i}`];
           }

           let randomString = Math.random().toString(36);

           this.setState({
               theInputKey: randomString
           });
           //console.log(this.state.submissions);
       }

    }

    componentDidUpdate() {
        Prism.highlightAll();

    }
    componentDidMount() {
        Prism.highlightAll();
    }



    render(){
        console.log("instruction", this.state.instruction);
            let reviewsToPost = this.state.studentsReview.map((review,index,array)=> {
                if (review.netId === this.state.netId && review.task === this.state.taskName) {
                    return review["tasksToReview"].map((element, index, array) => {
                        return <Menu.Item
                            name={element["title"]}
                            as='a'
                            onClick={(event) => this.handleItemClick(event,element)}
                            key={`oreview${index}`}
                        >
                            {element["title"]}
                        </Menu.Item>
                    })
                }
                else{

                }
            });

        const markdownInstruction = this.state.instruction;
        const rawHtml = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>

        let questionsToDisplay =  this.state.totalQuestions.map((question,index,array)=>{
            return <Form.Group key={`question${question["id"]}${index}`}>
                <Label tag content={question["id"]}/>
                <Form.Input name={`point${this.state.reviewId}${index}`} type= 'number' label='Points' placeholder='Points' width={4}
                            onChange={(e)=>this.handleChange(e)} key={`point${this.state.reviewId}${index}`}
                            value ={this.state[`point${this.state.reviewId}${index}`] || ""}/>
                <Form.Input name={`comment${this.state.reviewId}${index}`} label='Comments' placeholder='comments' width={10}
                            onChange={(e)=>this.handleChange(e)} key={`comment${this.state.reviewId}${index}`}
                            value = {this.state[`comment${this.state.reviewId}${index}`] || ""} />
            </Form.Group>
        })

        return <Grid  stackable>

            <Grid.Column>
               {/*Row for task name*/}
                    <Grid.Row>

                        <Segment style={{boxShadow:"none"}}>

                            <span><Header  textAlign={"center"} as={"h4"}>
                                <Icon name='tag'/>
                                {this.state.currentTask["task-name"]}
                            </Header>
                            </span>

                        </Segment>

                    </Grid.Row>
                {/*Form details that contain rest of task details*/}
                    <Grid.Row >

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
                           </Segment>
                       </Form>

                    </Grid.Row>

                <Header  textAlign={"center"} as={"h4"}>
                    <Icon name='code'/>
                    Submit Review
                </Header>
                {/*Form part where the review part starts*/}
                <Grid.Row columns={2}>

                    <Grid celled>
                        {/*View sample code*/}
                    <Grid.Column width={8}>

                        <Menu pointing secondary>
                                {reviewsToPost}

                        </Menu>

                        <Segment style={{overflow: 'auto',minHeight:330,maxHeight:330,maxWidth:500,minWidth:200 }}
                                 textAlign="left">

                            {rawHtml}
                        </Segment>

                    </Grid.Column>
                        {/*enter review*/}
                    <Grid.Column width={8}>
                        <Header  textAlign={"center"} as={"h4"}>
                            <Icon name='code'/>
                            Enter points here
                        </Header>
                        <hr/>

                        <Segment style={{overflow: 'auto',minHeight:330,maxHeight:330,maxWidth:500,minWidth:200 }}
                                 textAlign="left">
                            <Form>
                               {questionsToDisplay}

                                <Button icon='file' content='Submit' type={"button"} color={"green"}
                                        onClick={(event) =>this.handleSubmit(event)} disabled={ this.state.reviewId==""}/>


                            </Form>
                        </Segment>
                    </Grid.Column>
                    </Grid>
                </Grid.Row>


            </Grid.Column>
        </Grid>
    }
}