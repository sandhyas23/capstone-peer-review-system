/* This view is rendered when teacher clicks on the create task button
* */

import React from 'react';
import {
    Input,
    Grid,
    Icon,
    TextArea,
    Select,
    Header,
    Segment,
    Form,
    Modal,
    Button, Label,Table
} from 'semantic-ui-react';
//import createdTasks from '../data/createdSubmissionTasks';

import Prism from "prismjs";
//import ReactCommonmark from "react-commonmark";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
//import submissions from '../data/submissionsHw';
//import studentAssignment from '../data/studentAssignment';
import ViewTask from './viewTask';

//import TaskReview from "./taskReview"


export default class CreateReviewTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submissionTasks: this.props.submissionTasks,
            reviewTasks: this.props.reviewTasks,
            selectedType: "submission",
            instructions: "",
            selectedReview: "",
            dueDate: new Date(),
            rubricIds: [1],
            rubric: [],
            submissions:this.props.submissions,
            newAssignments:[],
            reviews:[],
            num:0,
            studentAssignment:[],
            isSubmitted:false
        }

    }


    componentDidUpdate() {
        Prism.highlightAll();

    }

    componentDidMount() {
        Prism.highlightAll();
    }


   // function to handle dropdown values
    handleChange(e, data) {
        this.setState({
            [data.name]: data.value
        });
        //console.log("onchanges", data.name);
    }
    
    // function to handle input change
    handleChanges = async(e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
        //console.log("onchanges", value);
    }

    // function to handle when only  rubric input
    handleRubricChange(e,element,index){
        // handle the input of rubric fields
        this.handleChanges(e).then(()=> {
            // create object for each rubric
            let rubric_task = {
                "rubric-name":this.state[`rubric${element}`],
                "points":this.state[`point${element}`],
                "criteria":this.state[`criteria${element}`],
            }
            // Add each rubric into an array and set in state
            this.state.rubric.splice(index, 1, rubric_task);
            this.setState({
                rubric: this.state.rubric,
            });

        });

    }

    //function to handle submit button 
    handleSubmit(e,num) {
        const _this = this;

            // When task type is submission
            if (this.state.selectedType === "submission") {
                let submissionTask = {
                    type: this.state.selectedType, "task-name": this.state.selectedReview,
                    due: this.state.dueDate.toISOString()
                };
                let createdSubmissionTask = this.state.submissionTasks.find((element,index,array)=>{
                    return element["task-name"] === this.state.selectedReview
                });
                if(typeof createdSubmissionTask === "undefined"){
                    console.log("inside if");
                    fetch('http://54.191.195.63:3000/submissionTask',{
                        method: 'POST',
                        headers:{
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify((submissionTask))
                    })
                        .then(function(response){
                            _this.state.submissionTasks.push(submissionTask);
                            _this.setState({
                                selectedType: "submission", instructions: "",
                                selectedReview: "", dueDate: new Date(),
                                submissionTasks:_this.state.submissionTasks,currentTask:submissionTask
                            });
                            _this.props.update();
                            alert("submission task created successfully");
                            console.log("submitted",_this.state.submissionTasks);
                            //e.preventDefault();
                        })
                }
                else{
                    alert("Submission task already exists");
                    this.setState({selectedReview:""});
                }
            
            } 
            // if type of task is review, handle submit
            else {
                // Assignment of students for review task before submit
                this.assignTask(e,num).then(()=> {
                    //console.log("submission task", submissionTask);
                    let reviewTask = {
                        "peer-review-for": this.state.selectedReview,
                        due: this.state.dueDate.toISOString(), rubric: this.state.rubric,
                        instructions: this.state.instructions
                    };
                    console.log(this.state.newAssignments);
                    let studentAssignments = {
                        "peer-review-for": this.state.selectedReview, studentsAssignment: this.state.newAssignments
                    }
                    fetch('http://54.191.195.63:3000/reviewTask', {
                        method: 'POST',
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify((reviewTask))
                    })
                        .then(function (response) {
                            _this.state.reviewTasks.push(reviewTask);
                            _this.state.studentAssignment.push(studentAssignments);
                            _this.setState({
                                selectedType: "review", instructions: "",
                                dueDate: new Date(), num: 0,
                                reviewTasks: _this.state.reviewTasks, studentAssignment: _this.state.studentAssignment,
                                currentTask: reviewTask,
                                // selectedReview: "",isSubmitted:true,
                            });
                            _this.props.update();
                            alert("review task created successfully");
                            console.log("review task", _this.state.reviewTasks);
                            //e.preventDefault();
                        });
                });
            }



    }
    
    // function to handle addition of new rubric
    addRubrics(e) {
        let lastElement = this.state.rubricIds[this.state.rubricIds.length-1];
        this.setState({rubricCount: this.state.rubricIds.push(lastElement + 1)});
    }

    // function to handle deletion of a rubric
    deleteRubrics(e,element,index){

        console.log(element);
        this.state.rubric.splice(index,1);
        let i = this.state.rubricIds.indexOf(element);
        this.state.rubricIds.splice(i,1);
        if(i > -1){
            this.setState({[`point${element}`]:undefined, [`rubric${element}`]:undefined,
                [`criteria${element}`]:undefined,rubric:this.state.rubric,rubricIds:this.state.rubricIds});
        }
        //console.log("deleted", this.state.rubricIds);

    }
    
    // function to handle the view of rubrics. Based on the number of rubrics in array, all rubrics are displayed
    displayRubrics() {
        let rubricsDisplay = this.state.rubricIds.map((element, index, array) => {
            console.log("displayed for loop", index + 1, "times");
            //return <div key={`index${element}`}>aaa</div>
        return <Form.Group key={`group${index}`} >
            <Label content={"Rubric"}/>
            <Form.Input name={`point${element}`}
                        type='number' label='Points' placeholder='Points' width={6}
                        onChange={(e) => this.handleRubricChange(e,element,index)}
                        key={`point${element}`}
                        required
                        min="1"
                        value={this.state[`point${element}`] || ""}/>
            <Form.Input name={`rubric${element}`}
                        label='rubric-name' placeholder='rubric-name'
                        required
                        width={8}
                        key={`rubric${element}`}
                        onChange={(e) => this.handleRubricChange(e,element,index)}
                        value={this.state[`rubric${element}`] || ""}/>
            <Form.TextArea name={`criteria${element}`}
                           label='criteria' placeholder='criteria'
                           width={12}
                           required
                           key={`criteria${element}`}
                           onChange={(e) => this.handleRubricChange(e,element,index)}
                           value={this.state[`criteria${element}`] ||"" }/>
            <Button basic icon size={"mini"} circular
                    onClick={(e) => this.addRubrics(e)}
                    disabled={!this.state[`point${element}`] ||!this.state[`rubric${element}`] ||
                    !this.state[`criteria${element}`] }>
                <Icon name='add'/>
            </Button>
            <Button basic icon size={"mini"} circular
                    onClick={(e) => this.deleteRubrics(e,element,index)}
                    disabled={this.state.rubricIds.length === 1}>
                <Icon name='delete'/>
            </Button>
        </Form.Group>
        });
        return rubricsDisplay;
    }

    // function to handle assignment of students 
     assignTask = async(e,num) => {
        console.log("called first");
        /* Algorithm 4 for peer review assignment problem.

        Dr. Greg M. Bernstein
        October 30th, 2019

        Fixed assignment, with array shuffle
        */
        let currentSubmissions = this.state.submissions.filter((item,index,array)=>{
           return item["assignment-name"] === this.state.selectedReview;
        });
        console.log(currentSubmissions);
        //const numStudents = 15;
        const numReviews = num;
        const length = currentSubmissions.length;

        // produce shuffled array
        let ordering = [];
        for (let i=0; i < length; i++) {
            ordering[i] = i;
        }

        shuffle(ordering);

        //console.log(ordering);
        // Keep track of who is reviewing each students assignment
        let assignments = [];
        for (let i = 0; i < length; i++) {
            let submitterId = currentSubmissions[ordering[i]].netId;
            let assignInfo = {student: submitterId, reviewers: new Set()};
            assignments.push(assignInfo);
        }

        // Keep track of the assignments each student is reviewing
        let reviews = [];
        for (let i = 0; i < length; i++) {
            let reviewerID = currentSubmissions[ordering[i]].netId;
            let reviewInfo = {student: reviewerID, reviewees: new Set()};
            reviews.push(reviewInfo);
        }

        console.log("Starting Algorithm");

        // Fixed mapping of reviewers to assignments based on
        // a circular pass the papers around notion.
        for (let i = 0; i < length; i++) {
            let assignment = assignments[i];
            let increment = 1;
            while (assignment.reviewers.size < numReviews) {
                let trial = (i+increment)%length;
                if (reviews[trial].reviewees.size >= numReviews) continue;
                let toBeReview = currentSubmissions[ordering[trial]].netId;
                assignment.reviewers.add(toBeReview);
                let whoToReview = currentSubmissions[ordering[i]].netId;
                //console.log("ordering",toBeReview);
                reviews[trial].reviewees.add(whoToReview);
                increment++;
            }
        }

        function sortFunc(a, b) {
            if (a.student > b.student) {
                return 1;
            } else {
                return -1;
            }
        }
        assignments.sort(sortFunc);
        reviews.sort(sortFunc);

        // Look at the results
        let newAssignments =[];
        for (let i = 0; i < length; i++) {
            console.log(assignments[i]);
            let assignedReviewers = Array.from(assignments[i]["reviewers"]);
            let assignedReviewees = Array.from(reviews[i]["reviewees"]);
            newAssignments.push({student:assignments[i]["student"],reviewers:assignedReviewers,
                reviewees:assignedReviewees});
            console.log("newAssignments",newAssignments);
            //console.log(reviews[i]);
            //console.log("\n");
        }

        let assignmentsOfStudents ={"peer-review-for":this.state.selectedReview,
            "studentsAssignment": newAssignments};
        console.log("assignment",assignmentsOfStudents);


            const _this = this;

             fetch('http://54.191.195.63:3000/studentAssignment/'+this.state.selectedReview, {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(assignmentsOfStudents)
            }).then(function (response) {
                _this.setState({newAssignments:newAssignments,reviews:reviews});
            });



        //this.setState({newAssignments:newAssignments,reviews:reviews});

        /**
         From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
         */
        // function getRandomIntInclusive(min, max) {
        //     min = Math.ceil(min);
        //     max = Math.floor(max);
        //     return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
        // }

        /* Shuffle an array in JavaScript the right way.
            From: https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
        */
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * i)
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
        //return [assignments,reviews];
    }


    // Display how the students are assigned for peer-review
    display(){
        if(this.state.newAssignments.length > 0){
            //console.log(this.state.assignments);
             return this.displayAssignments();
        }
    }

    displayAssignments(){
              //console.log("function called");
        //function to display the reviewers for each student
                function viewStudents(element){
                    let reviewers = element["reviewers"].map((item,index,array)=>{
                        return <Table.Cell key={`cell2${index}`}>
                            {item}
                        </Table.Cell>
                    });
                    return reviewers;
                }


             // Display all submitters for each task
            let submitterId = this.state.newAssignments.map((element,index,array)=>{
                return <Table.Row key={`row${index}`}>
                    <Table.Cell key={`cell${index}`}>
                        <Input transparent
                               key={`AssignmentValue${index}`}
                               name={`AssignmentValue${index}`}
                        >{element["student"]}
                        </Input>
                    </Table.Cell>
                    {viewStudents(element)}
                </Table.Row>
            });


       // return all the details in a modal
        return  <Modal trigger={<Button >View assignments</Button>}>
            <Modal.Header>Rubrics</Modal.Header>
            <Modal.Content  scrolling>

                <Modal.Description>
                    <Header>Modal Header</Header>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Submitter Id</Table.HeaderCell>
                                <Table.HeaderCell colSpan={this.state.num}>Reviewed by
                                </Table.HeaderCell>

                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {submitterId}
                        </Table.Body>
                    </Table>

                </Modal.Description>
            </Modal.Content>
        </Modal>
    }


    render(){
        //console.log("STATE",this.state);
        let options=[];
        // Get all closed submission tasks to display in a dropdown in create review task screen
        const reviewTasksDisplayed = this.state.submissionTasks.filter((element)=>{
            let taskDue = new Date(element["due"]).getTime();
            let now = new Date().getTime();
            const timeDifference = now-taskDue;
            if(timeDifference >= 0) {
                //console.log(element["task-name"]);
                return element;
            }
        });

        // Check if  a review task has been created for the above filtered tasks, then remove them from the dropdown
        if(reviewTasksDisplayed.length >0){
            let len = reviewTasksDisplayed.length;
            for(let i=0;i< this.state.reviewTasks.length;i++){
                for(let j=0; j< len;j++){
                    //console.log("www",reviewTasksDisplayed[j]["task-name"],this.state.reviewTasks[i]["peer-review-for"]);
                   if(reviewTasksDisplayed[j]["task-name"] === this.state.reviewTasks[i]["peer-review-for"]){
                       //console.log("inside if");
                       reviewTasksDisplayed.splice(j, 1);
                       len=reviewTasksDisplayed.length;

                       //console.log("options" ,options);
                   }
                }
            }
          // let submitterId = reviewTasksDisplayed.map((element,index,array)=>{
          //     options.push({key:`hw${index}${element["task-name"]}`,
          //         text:element["task-name"],
          //         value:element["task-name"] });
          // });
        }

        //console.log("review tasks",options)
        const taskType = this.state.selectedType;

         if(this.state.isSubmitted === true){
             return <ViewTask createdTask={this.state.currentTask} type={this.state.selectedType}
                              studentAssignment={this.state.studentAssignment}/>
         }
         else{
             return<div>
                 <div style={{marginLeft:10,marginRight:10,  minWidth: 550, marginTop:50}}>
                     <Grid  stackable>
                         <Grid.Column>

                             <Grid.Row >

                                 <Segment style={{boxShadow:"none"}} textAlign={"center"}>

                                     <Header  textAlign={"center"} as={"h4"}>
                                         <Icon name='tag'/>
                                         Create Task
                                     </Header>

                                 </Segment>
                             </Grid.Row>
                             <Grid.Row  textAlign={"center"}>
                                 <Segment align="center" >
                                     <Form align="center">
                                         <Form.Field inline required>
                                             <label>Task Type</label>
                                             <Select placeholder='task type'
                                                     value={this.state.selectedType}
                                                     name="selectedType" options={[
                                                 { key: 'submission', text: 'Submission', value: 'submission' },
                                                 { key: 'review', text: 'Review', value: 'review' },
                                             ]} onChange={(e,data)=>this.handleChange(e,data)}/>
                                         </Form.Field>
                                         {  /*Change display for screen if review or submission*/
                                             taskType === "review" ?
                                                 <div>
                                                     <Form.Field inline required>
                                                         <label>Task name</label>
                                                         <Select placeholder='Select the task name'
                                                                 name={"selectedReview"}
                                                                 value={this.state.selectedReview} options={options}
                                                                 onChange={(e,data)=>this.handleChange(e,data)}/>
                                                     </Form.Field>
                                                     <Form.Field inline required>
                                                         <label>Due</label>
                                                         <DatePicker
                                                             selected={this.state.dueDate}
                                                             onChange={date => this.setState({dueDate:date})}
                                                             showTimeSelect
                                                             timeFormat="p"
                                                             timeIntervals={15}
                                                             dateFormat="Pp"
                                                         />
                                                     </Form.Field>
                                                     <Form.Field inline required>
                                                         <label>General Instructions</label>
                                                         <TextArea style={{ minHeight: 100, minWidth:200, maxHeight: 100, maxWidth:300,}}
                                                                   placeholder={"markdown instructions"}
                                                                   name={"instructions"}
                                                                   value={this.state.instructions}
                                                                   onChange={(e)=>{this.handleChanges(e)}}/>
                                                     </Form.Field>
                                                     <Grid textAlign={"center"}>
                                                         <Grid.Column width={10}>
                                                             {this.displayRubrics()}
                                                         </Grid.Column>
                                                     </Grid>

                                                     <Form.Field inline required>
                                                         <label>Enter number of reviews</label>
                                                         <Input name={`num`}
                                                                type='number' label='num' placeholder='num' width={4}
                                                                onChange={(e) => this.handleChanges(e)}
                                                                min={1} max={10}
                                                                value={this.state.num}/>
                                                     </Form.Field>
                                                     {this.display()}
                                                     {/*<Button onClick={(e)=> this.assignTask(e,this.state.num)} disabled={!this.state.selectedReview}>*/}
                                                     {/*    Assign students for peer review*/}
                                                     {/*</Button>*/}
                                                     <span>
                                <Button type='submit' onClick={(e)=> this.handleSubmit(e,this.state.num)}
                                        disabled={!this.state.selectedReview || !this.state.num ||
                                        !this.state.instructions || !this.state.rubric }>Submit</Button>
                                </span>
                                                 </div>
                                                 /*Display for create submission task screen*/
                                                 :
                                                 <div>
                                                     <Form.Field inline required>
                                                         <label>Task name</label>
                                                         <Input placeholder='Eg: HW3'
                                                                name={"selectedReview"}
                                                                value={this.state.selectedReview}
                                                                onChange={(e)=>this.handleChanges(e)}/>
                                                     </Form.Field>
                                                     <Form.Field inline required>
                                                         <label>Due</label>
                                                         <DatePicker
                                                             selected={this.state.dueDate}
                                                             onChange={date => this.setState({dueDate:date})}
                                                             showTimeSelect
                                                             timeFormat="p"
                                                             timeIntervals={15}
                                                             dateFormat="Pp"
                                                         />
                                                     </Form.Field>
                                                     <span>
                                <Button type='submit' onClick={(e)=> this.handleSubmit(e)}
                                disabled={!this.state.selectedReview}>Submit</Button>
                                </span>
                                                 </div>

                                         }
                                     </Form>
                                 </Segment>

                             </Grid.Row>
                         </Grid.Column>

                     </Grid>
                 </div>

             </div>

         }
         }

}

