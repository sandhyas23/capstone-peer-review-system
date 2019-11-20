import React from 'react';
import {Button, Form, Grid, Header, Icon, Input, Label, Segment,Menu,Modal,Table} from "semantic-ui-react";
import studentsReview from "../data/reviewTasksStudents";
import studentAssignment from '../data/studentAssignment';
import submissions from '../data/submissionsHw';
import 'prismjs/themes/prism-coy.css';
import Prism from "prismjs";
import ReactCommonmark from "react-commonmark";



export default class TaskReview extends React.Component{
    constructor(props){
        super(props);
        this.state ={currentTask: this.props.currentTask , studentsReview:props.reviews, netId: this.props.netId,
            "assignment-name":this.props.currentTask["peer-review-for"],content:"Click a review link to view the submission",
            totalQuestions:[],
            theInputKey: "", fileName:"",
            reviewTasks:props.reviewTasks,
            studentAssignment:props.studentAssignment,
            submissions:props.submissions,
            totalRubricsToReview:[],
            rubric:[],
            rubricName:""}
            //console.log(this.state);
    }
    componentDidMount() {

        let _this = this;
        fetch('/reviews/' + this.state["assignment-name"] + '/reviewer/' + this.state.netId, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function (data) {

            console.log("this is what we got in task submit" + data.reviews);
            //_this.state.submissions.push(data.submission);
            const reviewerReviews = data.reviews;
            console.log("reviewerReviews", reviewerReviews);

            let foundElements = reviewerReviews.map((element, index, array) => {
                _this.setState({rubric:element["review"]["rubric"]});
                return [element["review"]["rubric"].map((rubric, ind, arr) => {
                    return _this.setState({
                        [`pointGiven${element["reviewer-id"]}${element["submitter-id"]}${rubric["rubric-name"]}`]:
                            rubric["points-given"],
                        [`comment${element["reviewer-id"]}${element["submitter-id"]}${rubric["rubric-name"]}`]:
                            rubric["comments"],

                    })
                }), _this.setState({[`submittedOn${element["submitter-id"]}${element["reviewer-id"]}`]:element["submittedOn"]})]

                // _this.setState({"submissions":data.reviews});

            });
            Prism.highlightAll();
        });
    }



    // static getDerivedStateFromProps(props,state){
    //     if(props === state){
    //         return null;
    //     }
    //     else {
    //         let task = state.studentsReview.find((task ,index,array) =>{
    //
    //             return (task["task"] === props.currentTask["peer-review-for"] && task["netId"] === props.netId)
    //         })
    //         if(typeof task === "undefined"){
    //             console.log("inside undefined");
    //             //console.log("props",props ,"state",state);
    //             return {
    //                 currentTask: props.currentTask, "assignment-name": props.currentTask["peer-review-for"],
    //                 content:"Click a review link to view the submission",totalQuestions:[],
    //                 fileName:""
    //             }
    //         }
    //         else{
    //
    //             console.log("inside found result");
    //             return {
    //                 currentTask: props.currentTask, "assignment-name": props.currentTask["peer-review-for"],
    //
    //             }
    //         }
    //     }
    //
    // }
    handleItemClick(event, review){

        let submission = this.state.submissions.find((element,index,array)=>{
            return element["assignment-name"] === this.state["assignment-name"] && element["netId"] === review;
        });
        let totalRubricsToReview = this.state.currentTask["rubric"];
       // console.log("content when clicked",submission["content"]);



            let cc = this.state.totalRubricsToReview.map((item,index,array)=> {
                 if (this.state[`pointGiven${this.state.netId}${review}${item["rubric-name"]}`] &&
                    this.state[`comment${this.state.netId}${review}${item["rubric-name"]}`]) {
                    console.log("inside if....");
                    let rubric_task = {
                        "rubric-name": item["rubric-name"],
                        "possible-points": item["points"],
                        "points-given": this.state[`pointGiven${this.state.netId}${review}${item["rubric-name"]}`],
                        "comments": this.state[`comment${this.state.netId}${review}${item["rubric-name"]}`],
                    };

                     this.state.rubric.splice(index,1,rubric_task);
                     console.log("spliced array",this.state.rubric);


                }
            });
       // console.log("content when clicked",submission["content"]);
        console.log("stateeeee before ",this.state.content, this.state.rubric);

            this.setState({rubric:this.state.rubric,reviewNo:review,totalRubricsToReview:totalRubricsToReview,
                content: submission["content"]
            });
        console.log("stateeeee after ",this.state.content,this.state.rubric);


    }

    handleChange = async(e,rubrics,index) =>{

        const target = e.target;
        const value = target.value;
        const name = target.name;
       // console.log("event:",e, "target",target);


        this.setState({
            [name]:value
        });


    }

    afterHandleChange(e,rubrics,index){
        this.handleChange(e,rubrics,index).then(()=> {

            let rubric_task = {
                "rubric-name": rubrics["rubric-name"],
                "possible-points": rubrics["points"],
                "points-given": this.state[`pointGiven${this.state.netId}${this.state.reviewNo}${rubrics["rubric-name"]}`],
                "comments": this.state[`comment${this.state.netId}${this.state.reviewNo}${rubrics["rubric-name"]}`],
            }
            this.state.rubric.splice(index, 1, rubric_task);
            this.setState({
                rubric: this.state.rubric, rubricName: rubrics["rubric-name"],
                "possible-points": rubrics["points"]
            });
        });

    }



    handleSubmit(event){
        let totalPoints =0;
        for (let i=0;i<this.state.rubric.length;i++){
            totalPoints += parseInt(this.state.rubric[i]["points-given"]);
        }
        let outOf =0;
        for (let i=0;i<this.state.rubric.length;i++){
            totalPoints += parseInt(this.state.rubric[i]["possible-points"]);
        }

       let reviewToPost = this.state.studentsReview.findIndex((element,index,array)=>{
           return (element["assignment-name"] === this.state["assignment-name"] &&
               element["reviewer-id"] === this.state.netId  && element["submitter-id"]=== this.state.reviewNo);
       });
        //console.log("length", reviewToPost["tasksToReview"]);
       if(reviewToPost === -1){
           console.log("inside if");
            let reviewTask ={"reviewerId": this.state.netId , "submitter-id":this.state.reviewNo,
            "assignment-name":this.state["assignment-name"],review:{"general-comments":"", rubric:this.state.rubric,
                "total-points":totalPoints}};

            const _this =this;
           fetch('/reviews/'+this.state["assignment-name"]+'/reviewer/'+this.state.netId+'/submitter/'+this.state.reviewNo
               , {
               method: 'PUT',
               headers: {
                   "Content-type": "application/json"
               },
               body: JSON.stringify(reviewTask)
           }).then(function (response) {
               _this.state.studentsReview.push(reviewTask);
               _this.setState({
                   studentsReview:_this.state.studentsReview,
                   [`submittedOn${_this.state.reviewNo}${_this.state.netId}`]: new Date()
               });
               alert("submitted task");
               console.log("submitted",_this.state.studentsReview);
               //_this.props.update();
               //event.preventDefault();
           });


       }
       else {

           let reviewTask = {
               "reviewerId": this.state.netId,
               "submitter-id": this.state.reviewNo,
               "assignment-name": this.state["assignment-name"],
               review: {"general-comments": "", rubric: this.state.rubric},
               "total-points":totalPoints
           };

           const _this = this;
           fetch('/reviews/' + this.state["assignment-name"] + '/reviewer/' + this.state.netId + '/submitter/' + this.state.reviewNo
               , {
                   method: 'PUT',
                   headers: {
                       "Content-type": "application/json"
                   },
                   body: JSON.stringify(reviewTask)
               }).then(function (response) {
               _this.state.studentsReview.splice(reviewToPost, 1,reviewTask);
               //_this.state.studentsReview.push(reviewTask);
               _this.setState({
                   studentsReview: _this.state.studentsReview,
                   [`submittedOn${_this.state.reviewNo}${_this.state.netId}`]: new Date()
               });
               console.log("submitted",_this.state.studentsReview);
               alert("submitted task");
           });
       }

       }

    componentDidUpdate() {
        Prism.highlightAll();

    }

    viewContent(){
        const markdownInstruction = this.state.content;
        const rawHtml1 = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>
        return <Segment style={{overflow: 'auto',minHeight:330,maxHeight:330,maxWidth:500,minWidth:200 }}
                        textAlign="left">

            {rawHtml1}
        </Segment>
    }




    render(){


        let reviewsToPost;
        console.log("content in state", this.state);

        let currentReview = this.state.studentAssignment.find((review,index,array)=>{
                return review["peer-review-for"] === this.state["assignment-name"];
            });
            //console.log("aaaa",currentReview);
         if(typeof currentReview !== "undefined") {
             let currentStudent = currentReview["studentsAssignment"].find((student, index, array) => {
                 return student["student"] === this.state.netId;
             });

              reviewsToPost = currentStudent["reviewees"].map((review, index, array) => {

                 //console.log("printed this",count+1,"times");
                 return <Menu.Item
                     name={`Review${index}`}
                     active={review === this.state.reviewNo}
                     as='a'
                     onClick={(event) => this.handleItemClick(event, review)}
                     key={`Review${review}${index}`}
                 >
                     {`Review${index}`}
                 </Menu.Item>
             });
         }
         else{
             return "nothing to display"
         }
        // const markdownInstruction = this.state.content;
        // const rawHtml1 = <div id="rawHtml" className="language-html">
        //     <ReactCommonmark source={markdownInstruction} />
        // </div>

        const generalInstructionmarkdown = this.state.currentTask["instructions"];
        const generalInstruction = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={generalInstructionmarkdown} />
        </div>

        let tableBody = this.state.currentTask["rubric"].map((item,index,array)=>{
            const markdownInstruction = item["criteria"];
            const rawHtml = <div id="rawHtml" className="language-html">
                <ReactCommonmark source={markdownInstruction} />
            </div>
            return <Table.Row key={`row${item["rubric-name"]}${index}`}>
                <Table.Cell key={`points${item["rubric-name"]}${index}`}>{item["points"]}</Table.Cell>
                <Table.Cell key={`rubric${item["rubric-name"]}${index}`}>{item["rubric-name"]}</Table.Cell>
                <Table.Cell key={`criteria${item["rubric-name"]}${index}`}>{rawHtml}</Table.Cell>
            </Table.Row>
        });

        let questionsToDisplay =  this.state.totalRubricsToReview.map((rubric,index,array)=>{
            return <Form.Group key={`rubric${rubric["rubric-name"]}${index}`}>
                <Label tag content={rubric["rubric-name"]}/>
                <Label content={rubric["points"]} />
                <Form.Input name={`pointGiven${this.state.netId}${this.state.reviewNo}${rubric["rubric-name"]}`} type= 'number' label='Points'
                            placeholder='Points' width={4} min="0" max={rubric["points"]}
                            onChange={(e)=>this.afterHandleChange(e,rubric,index)} key={`pointGiven${this.state.netId}${this.state.reviewNo}${rubric["rubric-name"]}`}
                            value ={this.state[`pointGiven${this.state.netId}${this.state.reviewNo}${rubric["rubric-name"]}`] || ""}/>
                <Form.Input name={`comment${this.state.netId}${this.state.reviewNo}${rubric["rubric-name"]}`} label='Comments' placeholder='comments' width={10}
                            onChange={(e)=>this.afterHandleChange(e,rubric,index)} key={`comment${this.state.netId}${this.state.reviewNo}${rubric["rubric-name"]}`}
                            value = {this.state[`comment${this.state.netId}${this.state.reviewNo}${rubric["rubric-name"]}`] || ""} />

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

                                   <Input readOnly style={{color:"green"}}>Open</Input>
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
                            <Header>Rubrics for {this.state.currentTask["peer-review-for"]}</Header>
                            <div>
                                General Instructions: {generalInstruction}
                            </div>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                    <Table.HeaderCell> Possible points</Table.HeaderCell>
                                        <Table.HeaderCell> Rubric name</Table.HeaderCell>
                                        <Table.HeaderCell> Criteria</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {tableBody}
                                </Table.Body>
                            </Table>

                        </Modal.Description>
                    </Modal.Content>
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

                        {this.viewContent()}

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

                                {this.state.reviewNo ?  <Button icon='file' content='Submit' type={"button"} color={"green"}
                                                                onClick={(event) =>this.handleSubmit(event)}
                                                                disabled={!this.state[`pointGiven${this.state.netId}${this.state.reviewNo}${this.state.rubricName}`]  ||
                                                                !this.state[`comment${this.state.netId}${this.state.reviewNo}${this.state.rubricName}`] }
                                />
                                :
                                <div>Click on a review id to submit reviews</div>}





                            </Form>
                            &nbsp;
                            {this.state.reviewNo?
                                this.state[`submittedOn${this.state.reviewNo}${this.state.netId}`]?
                                <div>
                                    <Label ribbon icon='star' content={`Submitted :
                             ${new Date(this.state[`submittedOn${this.state.reviewNo}${this.state.netId}`]).toLocaleString()}`}
                                           color="blue"/>
                                </div>
                                :
                                    <div>
                                        <Label ribbon icon='star' content={`Submitted : Not submitted`}
                                               color="blue"/>
                                    </div>
                                    :
                                <div></div>
                            }

                        </Segment>
                    </Grid.Column>
                    </Grid>
                </Grid.Row>


            </Grid.Column>
        </Grid>
    }
}