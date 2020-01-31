/*This component is rendered when a student clicks a task to review peers*/


import React from 'react';
import {Button, Form, Grid, Header, Icon, Input, Label, Segment, Menu, Modal, Table, Dropdown} from "semantic-ui-react";
// import studentsReview from "../data/reviewTasksStudents";
// import studentAssignment from '../data/studentAssignment';
// import submissions from '../data/submissionsHw';
import 'prismjs/themes/prism-coy.css';
import Prism from "prismjs";
import ReactCommonmark from "react-commonmark";
import Cookies from "universal-cookie";



export default class TaskReview extends React.Component{
    constructor(props){
        super(props);
        this.state ={currentTask: this.props.currentTask , studentsReview:this.props.reviews, netId: this.props.netId,
            "assignment-name":this.props.currentTask["peer-review-for"],content:"Click a review link to view the submission",
            totalQuestions:[],
            reviewTasks:this.props.reviewTasks,
            studentAssignment:this.props.studentAssignment,
            submissions:this.props.submissions,
            totalRubricsToReview:[],
            rubric:[],
            rubricName:""}
            //// console.log(this.state);
    }

    // called when a prop changed to return a new state
    static getDerivedStateFromProps(props,state){
        if(props.currentTask === state.currentTask){
            return null;
        }
        else {
                return {
                    currentTask: props.currentTask, "assignment-name": props.currentTask["peer-review-for"],
                    content:"Click a review link to view the submission",
                    reviewTasks:props.reviewTasks,
                    studentAssignment:props.studentAssignment,
                    submissions:props.submissions,
                }
            }
    }


    // Get the reviews of a particular student and set in state to display initially
    componentDidMount() {
        let _this = this;
        fetch('/reviews/' + this.state["assignment-name"] + '/reviewer/' + this.state.netId, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function (data) {

            //// console.log("this is what we got in task submit" + data.reviews);
            //_this.state.submissions.push(data.submission);
            const reviewerReviews = data.reviews;
           // // console.log("reviewerReviews", reviewerReviews);

            //Get all review details and set in state initially to display
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
        });
        Prism.highlightAll();
    }


    // Get the reviews of a particular student and set in state to display when a different review task is clicked
    componentDidUpdate(prevProps,prevState) {

        if (prevState["assignment-name"] !== this.state["assignment-name"]) {

            let _this = this;
            fetch('/reviews/' + this.state["assignment-name"] + '/reviewer/' + this.state.netId, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(response => response.json()).then(function (data) {

                //// console.log("this is what we got in task submit" + data.reviews);
                //_this.state.submissions.push(data.submission);
                const reviewerReviews = data.reviews;
               // // console.log("reviewerReviews", reviewerReviews);

                // get all review points and comments and set in state to display
                let foundElements = reviewerReviews.map((element, index, array) => {
                    _this.setState({rubric: element["review"]["rubric"]});
                    return [element["review"]["rubric"].map((rubric, ind, arr) => {
                        return _this.setState({
                            [`pointGiven${element["reviewer-id"]}${element["submitter-id"]}${rubric["rubric-name"]}`]:
                                rubric["points-given"],
                            [`comment${element["reviewer-id"]}${element["submitter-id"]}${rubric["rubric-name"]}`]:
                                rubric["comments"],

                        })
                    }), _this.setState({[`submittedOn${element["submitter-id"]}${element["reviewer-id"]}`]: element["submittedOn"]})]

                    // _this.setState({"submissions":data.reviews});

                });

            });

        }
        Prism.highlightAll();
    }


    // function to display the review a student screen when a submitter id is clicked
    handleItemClick(event, review){

        // Get the submission content of a submitter to be reviewed
        let content = "";
        let submission = this.state.submissions.find((element,index,array)=>{
            return element["assignment-name"] === this.state["assignment-name"] && element["netId"] === review;
        });
        if(typeof submission !== "undefined"){
            content = submission["content"];
        }
        // get all rubrics to review for the clicked task
        let totalRubricsToReview = this.state.currentTask["rubric"];
       // // console.log("content when clicked",submission["content"]);


            //Display all rubrics to be reviewed. Get points and comments values from state and display it .

            let displayRubrics = this.state.totalRubricsToReview.map((item,index,array)=> {
                 if (this.state[`pointGiven${this.state.netId}${review}${item["rubric-name"]}`] &&
                    this.state[`comment${this.state.netId}${review}${item["rubric-name"]}`]) {
                    // console.log("inside if....");
                    let rubric_task = {
                        "rubric-name": item["rubric-name"],
                        "possible-points": item["points"],
                        "points-given": this.state[`pointGiven${this.state.netId}${review}${item["rubric-name"]}`],
                        "comments": this.state[`comment${this.state.netId}${review}${item["rubric-name"]}`],
                    };

                     this.state.rubric.splice(index,1,rubric_task);
                     // console.log("spliced array",this.state.rubric);


                }
            });


        // update the rubrics , submitter id and the submission content to state
            this.setState({rubric:this.state.rubric,reviewNo:review,totalRubricsToReview:totalRubricsToReview,
                content: content
            });
        //// console.log("state after ",this.state.content,this.state.rubric);
    }


    // function to handle input change
    handleChange = async(e,rubrics,index) =>{

        const target = e.target;
        const value = target.value;
        const name = target.name;
       // // console.log("event:",e, "target",target);


        this.setState({
            [name]:value
        });


    }

    // function to handle points and comments input
    afterHandleChange(e,rubrics,index){
        // save the entered/changed details in state first
        this.handleChange(e,rubrics,index).then(()=> {

            let rubric_task = {
                "rubric-name": rubrics["rubric-name"],
                "possible-points": rubrics["points"],
                "points-given": this.state[`pointGiven${this.state.netId}${this.state.reviewNo}${rubrics["rubric-name"]}`],
                "comments": this.state[`comment${this.state.netId}${this.state.reviewNo}${rubrics["rubric-name"]}`],
            }
            //update the state values in the rubric array
            this.state.rubric.splice(index, 1, rubric_task);
            this.setState({
                rubric: this.state.rubric, rubricName: rubrics["rubric-name"],
                "possible-points": rubrics["points"]
            });
        });

    }


// function to handle submit button of reviews
    handleSubmit(event) {
        const cookies = new Cookies();
        //const gotCookie =cookies.get('user');
        if (typeof cookies.get('user') === "undefined") {
            alert("session expired");
            this.props.onclickLogout()
        } else {

            let unacceptedPoints = this.state["rubric"].filter((element,index,array)=>{
                return parseInt(element["points-given"] )> parseInt(element["possible-points"]) ||
                    parseInt(element["points-given"]) < 0
            });
            if(unacceptedPoints.length > 0){
                alert("Given points not valid. Please change them");
            }
            else {
                // get total points for each review
                let totalPoints = 0;
                for (let i = 0; i < this.state.rubric.length; i++) {
                    totalPoints += parseInt(this.state.rubric[i]["points-given"]);
                }

                // find if a review has been posted already for the submitter
                let reviewToPost = this.state.studentsReview.findIndex((element, index, array) => {
                    return (element["assignment-name"] === this.state["assignment-name"] &&
                        element["reviewer-id"] === this.state.netId && element["submitter-id"] === this.state.reviewNo);
                });
                //// console.log("length", reviewToPost["tasksToReview"]);

                // if review not submitted, create a new review object and update in database and array
                if (reviewToPost === -1) {
                    // console.log("inside if");
                    let reviewTask = {
                        "reviewerId": this.state.netId, "submitter-id": this.state.reviewNo,
                        "assignment-name": this.state["assignment-name"], review: {
                            "general-comments": "", rubric: this.state.rubric,
                            "total-points": totalPoints
                        }
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
                        _this.state.studentsReview.push(reviewTask);
                        _this.setState({
                            studentsReview: _this.state.studentsReview,
                            [`submittedOn${_this.state.reviewNo}${_this.state.netId}`]: new Date()
                        });
                        alert("submitted review for this submitter");
                        // console.log("submitted", _this.state.studentsReview);
                    });


                }

                // if review already submitted, update the submitted review in the array and database
                else {
                    let reviewTask = {
                        "reviewerId": this.state.netId,
                        "submitter-id": this.state.reviewNo,
                        "assignment-name": this.state["assignment-name"],
                        review: {"general-comments": "", rubric: this.state.rubric},
                        "total-points": totalPoints
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
                        _this.state.studentsReview.splice(reviewToPost, 1, reviewTask);
                        //_this.state.studentsReview.push(reviewTask);
                        _this.setState({
                            studentsReview: _this.state.studentsReview,
                            [`submittedOn${_this.state.reviewNo}${_this.state.netId}`]: new Date()
                        });
                        // console.log("submitted", _this.state.studentsReview);
                        alert("submitted review for this submitter");
                    });
                }
            }

        }
    }


       // function to display the submission content in highlighted form
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

    // render function to display
    render(){

        // Condition to check if all fields are filled before submit or disable submit button
        let isEnabled = true;
        let count =this.state.totalRubricsToReview.length;
        for(let i=0 ; i<this.state.totalRubricsToReview.length;i++){
            if(this.state.rubric[i]){
               // // console.log("inside this noe")
                //// console.log("comments",this.state.rubric[i]["comments"] )
                if(this.state.rubric[i]["points-given"] === undefined ||  this.state.rubric[i]["comments"] === undefined){
                    //// console.log("comments",this.state.rubric[i]["comments"] )
                    isEnabled=false
                }
            }
            else{
                isEnabled =false;
            }
        }
        if(count !== this.state.totalRubricsToReview.length){
            isEnabled =false
        }



        let reviewsToPost;
       // // console.log("content in state", this.state);


       //Get all students for which the reviewer needs to submit reviews without displaying the id or name
        let currentReview = this.state.studentAssignment.find((review,index,array)=>{
                return review["peer-review-for"] === this.state["assignment-name"];
            });

         if(typeof currentReview !== "undefined") {
             let currentStudent = currentReview["studentsAssignment"].find((student, index, array) => {
                 //// console.log("student",student["student"] === this.state.netId);
                 return student["student"] === this.state.netId;
             });
              if(typeof currentStudent !== "undefined"){
                  //// console.log("inside kkkk");
                  if(this.state.studentAssignment.length < 4){
                      reviewsToPost = currentStudent["reviewees"].map((review, index, array) => {

                          //Display all reviews to be submitted in a menu
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
                      reviewsToPost = currentStudent["reviewees"].map((review, index, array) => {
                          return <Dropdown.Item
                              name={`Review${index}`}
                              active={review === this.state.reviewNo}
                              as='a'
                              onClick={(event) => this.handleItemClick(event, review)}
                              key={`Review${review}${index}`}
                          >
                              {`Review${index}`}
                          </Dropdown.Item>
                      });
                  }

              }

         }
         else{
             return "nothing to display"
         }


         // Display the general rubrics to follow for this assignment
        const generalInstructionmarkdown = this.state.currentTask["instructions"];
        const generalInstruction = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={generalInstructionmarkdown} />
        </div>

        // display other rubrics to follow in a table
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


        // Input review details(points and comments) for each rubric for a student
        let questionsToDisplay =  this.state.totalRubricsToReview.map((rubric,index,array)=>{
            return <Form.Group key={`rubric${rubric["rubric-name"]}${index}`}>
                <Label tag content={rubric["rubric-name"]}/>
                <Label content={rubric["points"]} />
                <Form.Input name={`pointGiven${this.state.netId}${this.state.reviewNo}${rubric["rubric-name"]}`}
                            type= 'number'
                            label='Points'
                            placeholder='Points' width={4} min="0" max={rubric["points"]}
                            required
                            onChange={(e)=>this.afterHandleChange(e,rubric,index)}
                            key={`pointGiven${this.state.netId}${this.state.reviewNo}${rubric["rubric-name"]}`}
                            value ={this.state[`pointGiven${this.state.netId}${this.state.reviewNo}${rubric["rubric-name"]}`] || ""}/>
                <Form.Input name={`comment${this.state.netId}${this.state.reviewNo}${rubric["rubric-name"]}`}
                            required label='Comments' placeholder='comments' width={10}
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
                               <Form.Field inline >
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
                {/*Modal to display the rubrics info to follow for the assignment*/}
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
                                    {/*rubric details to display*/}
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

                        {/*display submitter ids to review in a menu*/}
                        {this.state.studentAssignment.length < 4 ?
                            <Menu pointing secondary>
                                {reviewsToPost}
                            </Menu>
                            :
                            <Dropdown button color={"teal"} text='Submission tasks' labeled className='icon' floating  icon='tasks'>
                                <Dropdown.Menu>
                                    {reviewsToPost}
                                </Dropdown.Menu>
                            </Dropdown>
                        }

                        {/*Display the submission content*/}
                        {this.viewContent()}

                    </Grid.Column>
                        {/*enter actual reviews*/}
                    <Grid.Column width={8}>
                        <Header  textAlign={"center"} as={"h4"}>
                            <Icon name='code'/>
                            Enter points here
                        </Header>
                        <hr/>

                        <Segment style={{overflow: 'auto',minHeight:330,maxHeight:330,maxWidth:500,minWidth:200 }}
                                 textAlign="left">

                            <Form>
                                {/*Display each rubric for reviewer to enter points and comments*/}
                               {questionsToDisplay}

                                {this.state.reviewNo ?
                                    <Button icon='file'
                                            content='Submit'
                                            type={"button"}
                                            color={"green"}
                                            onClick={(event) =>this.handleSubmit(event)}
                                            disabled={!isEnabled || this.state.rubric.length <= 0}
                                />
                                :
                                    /*if no submitter id exists or clicked, display this*/
                                <div>Click on a review id to submit reviews</div>}





                            </Form>
                            &nbsp;
                            {/*get the submitted time for a review submitted*/}
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