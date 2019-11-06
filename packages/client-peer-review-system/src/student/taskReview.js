import React from 'react';
import {Button, Form, Grid, Header, Icon, Input, Label, Segment,Menu,Modal} from "semantic-ui-react";
import studentsReview from "../data/reviewTasksStudents";
import studentAssignment from '../data/studentAssignment';
import submissions from '../data/submissionsHw';
import 'prismjs/themes/prism-coy.css';
import Prism from "prismjs";
import ReactCommonmark from "react-commonmark";



export default class TaskReview extends React.Component{
    constructor(props){
        super(props);
        this.state ={currentTask: this.props.currentTask , studentsReview:studentsReview, netId: this.props.netId,
            "assignment-name":this.props.currentTask["peer-review-for"],content:"Click a review link to view the submission",
            totalQuestions:[],
            theInputKey: "", fileName:"",
            reviewTasks:props.reviewTasks,
            studentAssignment:studentAssignment,
            submissions:submissions,
            totalRubricsToReview:[],
            rubric:[]}
            //console.log(this.state);
    }

    static getDerivedStateFromProps(props,state){
        if(props === state){
            return null;
        }
        else {
            let task = state.studentsReview.find((task ,index,array) =>{

                return (task["task"] === props.currentTask["peer-review-for"] && task["netId"] === props.netId)
            })
            if(typeof task === "undefined"){
                console.log("inside undefined");
                //console.log("props",props ,"state",state);
                return {
                    currentTask: props.currentTask, "assignment-name": props.currentTask["peer-review-for"],
                    content:"Click a review link to view the submission",totalQuestions:[],
                    fileName:""
                }
            }
            else{

                console.log("inside found result");
                return {
                    currentTask: props.currentTask, "assignment-name": props.currentTask["peer-review-for"],

                }
            }
        }

    }
    handleItemClick(event, review){

        let submission = this.state.submissions.find((element,index,array)=>{
            return element["assignment-name"] === this.state["assignment-name"] && element["netId"] === review;
        });

        let totalRubricsToReview = this.state.currentTask["rubric"];
        console.log("content when clicked",submission["content"]);

        this.setState({totalRubricsToReview:totalRubricsToReview,content:submission["content"],
        reviewNo:review});
        //console.log("questions", this.state.questions);
        //console.log("content when clicked",this.state.content);
    }

    handleChange(e,rubrics,index){

        const target = e.target;
        const value = target.value;
        const name = target.name;
       // console.log("event:",e, "target",target);


        this.setState({
            [name]:value
        });

        let newElement = this.state.rubric[index];
        if(!newElement){
            this.state.rubric.push({"rubric-name": rubrics["rubric-name"],
                "possible-points":rubrics["points"],
                "points-given":this.state[`pointGiven${this.state.reviewNo}${index}`],
                "comments":this.state[`comment${this.state.reviewNo}${index}`],
              });
            this.setState({rubric:this.state.rubric});

        }
        else{
            if(name === `pointGiven${this.state.reviewNo}${index}`){
                let tempArray = this.state.rubric;
                tempArray[index]["points-given"] = value;
                this.setState({rubric:tempArray});

            }
            if(name === `comment${this.state.reviewNo}${index}`){
                let tempArray = this.state.rubric;
                tempArray[index]["comments"] = value;
                this.setState({rubric:tempArray});

            }
        }

    }

    handleSubmit(event){
       let reviewToPost = this.state.studentsReview.findIndex((element,index,array)=>{
           return (element["assignment-name"] === this.state["assignment-name"] &&
               element["reviewer-id"] === this.state.netId  && element["submitter-id"]=== this.state.reviewNo);
       });
        //console.log("length", reviewToPost["tasksToReview"]);
       if(reviewToPost === -1){
           console.log("inside if");
            let reviewTask ={"reviewerId": this.state.netId , "submitter-id":this.state.reviewNo,
            "assignment-name":this.state["assignment-name"],review:{"general-comments":"", rubric:this.state.rubric}};

            this.state.studentsReview.push(reviewTask);
            console.log("review to post",reviewTask);
            alert("submitted task");

       }
       else{
           console.log("inside else");
           this.state.studentsReview.splice(reviewToPost,1);

           let reviewTask ={"reviewerId": this.state.netId , "submitter-id":this.state.reviewNo,
               "assignment-name":this.state["assignment-name"],review:{"general-comments":"", rubric:this.state.rubric}};

           this.state.studentsReview.push(reviewTask);
           console.log("review to post",reviewTask);
           alert("submitted task");


       }

    }

    componentDidUpdate() {
        Prism.highlightAll();

    }
    componentDidMount() {
        Prism.highlightAll();
    }



    render(){
        console.log("content in state", this.state);

        let currentReview = this.state.studentAssignment.find((review,index,array)=>{
                return review["peer-review-for"] === this.state["assignment-name"];
            });
            //console.log("aaaa",currentReview);
            let currentStudent = currentReview["studentsAssignment"].find((student,index,array)=>{
                return student["student"] === this.state.netId;
            });

            let reviewsToPost = currentStudent["reviewees"].map((review,index,array)=> {

                      //console.log("printed this",count+1,"times");
                        return <Menu.Item
                            name={`Review${index}`}
                            as='a'
                            onClick={(event) => this.handleItemClick(event,review)}
                            key={`Review${review}${index}`}
                        >
                            {`Review${index}`}
                        </Menu.Item>
            });

        const markdownInstruction = this.state.content;
        const rawHtml = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>

        let questionsToDisplay =  this.state.totalRubricsToReview.map((rubric,index,array)=>{
            return <Form.Group key={`rubric${rubric["rubric-name"]}${index}`}>
                <Label tag content={rubric["rubric-name"]}/>
                <Label content={rubric["points"]} />
                <Form.Input name={`pointGiven${this.state.reviewNo}${index}`} type= 'number' label='Points'
                            placeholder='Points' width={4}
                            onChange={(e)=>this.handleChange(e,rubric,index)} key={`pointGiven${this.state.reviewNo}${index}`}
                            value ={this.state[`pointGiven${this.state.reviewNo}${index}`] || ""}/>
                <Form.Input name={`comment${this.state.reviewNo}${index}`} label='Comments' placeholder='comments' width={10}
                            onChange={(e)=>this.handleChange(e,rubric,index)} key={`comment${this.state.reviewNo}${index}`}
                            value = {this.state[`comment${this.state.reviewNo}${index}`] || ""} />

            </Form.Group>
        });



        return <Grid  stackable>

            <Grid.Column>
               {/*Row for task name*/}
                    <Grid.Row>

                        <Segment style={{boxShadow:"none"}}>

                            <span><Header  textAlign={"center"} as={"h4"}>
                                <Icon name='tag'/>
                                {this.state.currentTask["peer-review-for"]}
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
                <span> <Modal trigger={<Button>View Rubrics</Button>}>
                    <Modal.Header>Rubrics</Modal.Header>
                    <Modal.Content  scrolling>

                        <Modal.Description>
                            <Header>Modal Header</Header>
                            <p>
                                This is an example of expanded content that will cause the modal's
                                dimmer to scroll This is an example of expanded content that will cause the modal's
                                dimmer to scroll This is an example of expanded content that will cause the modal's
                                dimmer to scroll This is an example of expanded content that will cause the modal's
                                dimmer to scroll This is an example of expanded content that will cause the modal's

                            </p>

                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button primary>
                            Download <Icon name='chevron right' />
                        </Button>
                    </Modal.Actions>
                </Modal>
                    </span>

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
                                        onClick={(event) =>this.handleSubmit(event)} />

                            </Form>
                        </Segment>
                    </Grid.Column>
                    </Grid>
                </Grid.Row>


            </Grid.Column>
        </Grid>
    }
}