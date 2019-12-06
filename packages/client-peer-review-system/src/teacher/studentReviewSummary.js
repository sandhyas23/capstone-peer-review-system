/*This view is rendered when teacher clicks on a task under review tasks.
* Teacher can view all reviews given for each student for a task and can edit any of the reviews given by their peers.
* Teacher can also task details like due date, rubrics*/
import React from 'react';
import {
    Menu,
    Icon,
    Grid,
    Header,
    Segment,
    Table, Input, Form, Label, Select, Button, Modal, Confirm, TextArea
} from 'semantic-ui-react';

import 'prismjs/themes/prism-coy.css';
import "react-datepicker/dist/react-datepicker.css";
import Prism from "prismjs";
import ReactCommonmark from "react-commonmark";
import DatePicker from "react-datepicker";
import Cookies from "universal-cookie";



export default class StudentReviewSummary extends React.Component{
    constructor(props){
        super(props);
        this.state = {specificReviews:props.specificReviews, currentRTask:props.currentRTask ,content:"",
                      specSubmissions:props.specSubmissions, reviewDetails:[],reviewRubric:[],
            "peer-review-for":props.currentRTask["peer-review-for"],
            due:new Date(props.currentRTask["due"]), specAssignments:props.specAssignments,
            teacherRubrics:props.currentRTask["rubric"],
        open:false, reviewTasks:props.reviewTasks,isDeleted:false,isEdited:false,isTaskEdited:false,isSaved:false,
        instructions:props.currentRTask["instructions"]}

    }

    //When a props is changed, a new state is returned
    static getDerivedStateFromProps(props,state){
        if(props.currentRTask === state.currentRTask){
            return null;
        }
        else{
            return {specificReviews:props.specificReviews, currentRTask:props.currentRTask ,
                specSubmissions:props.specSubmissions,
                "peer-review-for":props.currentRTask["peer-review-for"],
                due:new Date(props.currentRTask["due"]), specAssignments:props.specAssignments,
                teacherRubrics:props.currentRTask["rubric"],
                reviewTasks:props.reviewTasks,
                instructions:props.currentRTask["instructions"]}
        }

    }
    
    componentDidUpdate(prevProps, prevState) {
        //// console.log('Component did update!',);
        // // console.log("prevprops",prevProps);
        // // console.log("prevState",prevState);

        // When another task is selected,  change the rubric details and review details in the state
        if(prevState["peer-review-for"] !== this.state["peer-review-for"]){
            // set rubric details
            let rubricsDisplay = this.state.currentRTask["rubric"].map((element, index, array) => {
                //// console.log("displayed for loop", index + 1, "times");

                this.setState({
                    [`point${index}`]: element["points"],
                    [`rubric${index}`]: element["rubric-name"],
                    [`criteria${index}`]: element["criteria"],
                });
            });
            // set review details of students
            let reviewsDisplay = this.state.specificReviews.map((element,index,array)=>{
                element["review"]["rubric"].map((item,ind,arr)=>{
                    // console.log("elementin update",element);
                    this.setState({
                        [`inputPoint${item["rubric-name"]}${element["submitter-id"]}${element["reviewer-id"]}`]: item["points-given"],
                        [`inputComment${item["rubric-name"]}${element["submitter-id"]}${element["reviewer-id"]}`]: item["comments"]

                    });
                });
            });
        }

        Prism.highlightAll();

    }

    componentDidMount() {
        // set the rubric details and review details in the state when the component is initially mounted
        let rubricsDisplay = this.state.currentRTask["rubric"].map((element, index, array) => {
            //// console.log("displayed for loop", index + 1, "times");

            this.setState({
                [`point${index}`]: element["points"],
                [`rubric${index}`]: element["rubric-name"],
                [`criteria${index}`]: element["criteria"],
            });
        });

        let reviewsDisplay = this.state.specificReviews.map((element,index,array)=>{
            element["review"]["rubric"].map((item,ind,arr)=>{
                // console.log("elementin mount",element);
                this.setState({
                    [`inputPoint${item["rubric-name"]}${element["submitter-id"]}${element["reviewer-id"]}`]: item["points-given"],
                    [`inputComment${item["rubric-name"]}${element["submitter-id"]}${element["reviewer-id"]}`]: item["comments"]

                });
            });
        });

        Prism.highlightAll();
    }
    
    // function to display the total points  for a student
    viewPoints(item){

            let submitters = this.state.specificReviews.filter((element ,index,array)=>{
                return element["submitter-id"] === item
            });
            let totalPoints = submitters.map((element,index,array)=>{
                //// console.log(element["total-points"]);
                if(element["review"]["total-points"] < 10){
                    return <Table.Cell negative key={`review${element["reviewer-id"]}`}>
                        {element["review"]["total-points"]}
                    </Table.Cell>
                }
                else{
                    return <Table.Cell  key={`review${element["reviewer-id"]}`}>
                        {element["review"]["total-points"]}
                    </Table.Cell>
                }

            });
            return totalPoints;
        }


    // function to get all reviewer details and submission content for each submitter and set in state
    handleItemClick(event,item){
        // console.log("clicked review item");
        let content="";
        let submission = this.state.specSubmissions.find((element,index,array)=>{
            //// console.log(element["assignment-name"]);
            return element["netId"] === item;
        });
        if(typeof submission !="undefined"){
            content=submission["content"];
        }

        let reviewDetails = this.state.specificReviews.filter((element,index,array)=>{
            return element["submitter-id"] === item;

        });
        // console.log("reviewDetails",reviewDetails);

        //// console.log("content",content)
        this.setState({content:content, reviewDetails:reviewDetails,"student-id":item,
            viewReviews:false, "reviewer-id":""});
    }
    
    // function to display the submission content of each submitter
    viewContents(){
        const markdownInstruction = this.state.content;
        const rawHtml = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>
        return <Segment style={{overflow: 'auto',minHeight:500,maxHeight:330,maxWidth:1000,minWidth:150 }}>
            {rawHtml}
        </Segment>
    }

    // function to set the state with the review points and comments for each submitter when a reviewer is clicked
    handleReviewClick(event,review){
        // console.log("clicked",review, review["review"]["rubric"]);
        this.setState({"reviewRubric": review["review"]["rubric"], "reviewer-id":review["reviewer-id"],
                     viewReviews:true
        });

    }

    //  function to add a rubric for a review task
    addRubrics(e) {
        this.state.teacherRubrics.push({"points": "", "rubric-name": "",
            "criteria": ""});
        //let lastElement = this.state.rubricIds[this.state.rubricIds.length-1];
        this.setState({teacherRubrics: this.state.teacherRubrics});
    }

    // toggle the view when edit review button is clicked
    handleEditReviews(e){
        this.setState({isEdited:true});
    }
    
    // toggle the view when edit task button is clicked
    handleEditTaskDetails(e){
        this.setState({isTaskEdited:true});
    }

    // deleteRubrics(e,element,index){
    //
    //     let ad = this.state.currentRTask["rubric"].findIndex((item,index,arr)=>{
    //         return item["rubric-name"] == element["rubric-name"];
    //     })
    //
    //    delete this.state.currentRTask["rubric"][ad];
    //     this.setState({[`point${element}["rubric-name"]}${index}`]:undefined,
    //         [`rubric${element}["rubric-name"]}${index}`]:undefined,
    //         [`criteria${element}["rubric-name"]}${index}`]:undefined,
    //         rubrics:this.state.currentRTask["rubric"]})

        // // console.log(element);
        // this.state.rubric.splice(index,1);
        // let i = this.state.rubricIds.indexOf(element);
        // this.state.rubricIds.splice(i,1);
        // if(i > -1){
        //     this.setState({[`point${element}`]:undefined, [`rubric${element}`]:undefined,
        //         [`criteria${element}`]:undefined,rubric:this.state.rubric,rubricIds:this.state.rubricIds});
        // }
        //// console.log("deleted", this.state.rubricIds);

    //}

    // function to handle when only  rubric input
    handleRubricChange(e,element,index) {
        // handle the input of rubric fields
        this.handleEachChange(e).then(() => {
            // create object for each rubric
            let rubric_task = {
                "rubric-name": this.state[`rubric${index}`],
                "points": this.state[`point${index}`],
                "criteria": this.state[`criteria${index}`],
            }
            // Add each rubric into an array and set in state
            this.state.teacherRubrics.splice(index, 1, rubric_task);
            this.setState({
                teacherRubrics: this.state.teacherRubrics,
            });
        });
    }

    // function to edit the review task details
    handleEditTask(e){
        const cookies = new Cookies();
        const gotCookie =cookies.get('user');
        if(typeof cookies.get('user') === "undefined") {
            alert("session expired");
            this.props.onclickLogout()
        }
        else {
            let taskIndex = this.state.reviewTasks.findIndex((item, index, arry) => {
                return item["peer-review-for"] === this.state["peer-review-for"];
            });
            const _this = this;
            let reviewTask = {
                "peer-review-for": this.state["peer-review-for"],
                due: this.state.due.toISOString(), rubric: this.state.teacherRubrics,
                instructions: this.state.instructions
            };
            let studentAssign = this.state.specAssignments;
            // Update the review task details
            fetch('/reviewTask/' + this.state.currentRTask["peer-review-for"], {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(reviewTask)
            }).then(() => {
                // change task details in studentAssignment as well
                fetch('/studentAssignment/' + this.state.currentRTask["task-name"], {
                    method: 'PUT',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(studentAssign)
                }).then(function (response) {
                    // console.log("inside this");
                    _this.props.update();
                })
            }).then(function (response) {
                _this.state.reviewTasks.splice(taskIndex, 1, reviewTask);
                _this.setState({isTaskEdited: false, reviewTasks: _this.state.reviewTasks,});
            });
        }
    }

    // function to handle the input change
    handleEachChange = async(e,rubrics,index) =>{
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]:value
        });


    }

    // function to edit a review posted by a student
    handleEditOneReview(e,item,index){
        // function to handle input changes for review points and comment posted by a student
        this.handleEachChange(e).then(()=> {

            let rubric_task = {
                "rubric-name": item["rubric-name"],
                "possible-points": item["possible-points"],
                "points-given": this.state[`inputPoint${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`],
                "comments": this.state[`inputComment${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`],
            }
            this.state.reviewRubric.splice(index, 1, rubric_task);
            this.setState({
                reviewRubric: this.state.reviewRubric
            });
        });

    }

    // function to handle save button when clicked
    handleSaveReviews(e){
        const cookies = new Cookies();
        //const gotCookie =cookies.get('user');
        if(typeof cookies.get('user') === "undefined") {
            alert("session expired");
            this.props.onclickLogout()
        }
        else {
            //Get total points
            let totalPoints = 0;
            for (let i = 0; i < this.state.reviewRubric.length; i++) {
                totalPoints += parseInt(this.state.reviewRubric[i]["points-given"]);
            }

            // get index of the review that is edited
            let reviewIndex = this.state.specificReviews.findIndex((element) => {
                return element["reviewer-id"] === this.state["reviewer-id"] && element["submitter-id"] === this.state["student-id"];
            })

            const _this = this;

            let editedReviews = {
                "assignment-name": this.state["peer-review-for"], "reviewer-id": this.state["reviewer-id"],
                "submitter-id": this.state["student-id"],
                review: {"total-points": totalPoints, "general-comments": "", rubric: this.state.reviewRubric}
            };

            // Update the review details in the database
            fetch('/reviews/' + this.state["peer-review-for"] + '/reviewer/' + this.state["reviewer-id"] + '/submitter/' + this.state["student-id"]
                , {
                    method: 'PUT',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(editedReviews)
                }).then(function (response) {
                _this.state.specificReviews.splice(reviewIndex, 1, editedReviews);
                _this.setState({
                    specificReviews: _this.state.specificReviews, isEdited: false
                });
            });
        }

    }

    // function to handle the delete task. Displays a confirm dialog box with cancel and yes buttons
    handleDeleteTask(){
        this.setState({ open: true })

    }

// function to handle cancel button in the delete confirm dialog box
    handleCancel =() =>{
        this.setState({open:false})
    }

    // function to handle yes button in the delete conform dialog box
    handleConfirm = ()=> {
        const cookies = new Cookies();
        //const gotCookie =cookies.get('user');
        if(typeof cookies.get('user') === "undefined") {
            alert("session expired");
            this.props.onclickLogout()
        }
        else {
            const _this = this;
            let taskIndex = _this.state.reviewTasks.findIndex((item, index, arry) => {
                return item["peer-review-for"] === this.state["peer-review-for"];
            });
            //Delete task from database
            fetch('/ReviewTask/' + this.state.currentRTask["peer-review-for"], {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json"
                }
            }).then(function (response) {
                //alert("Task has been deleted");
                _this.setState({open: false});
                _this.props.update();

            }).then(() => {
                // Delete reviews after deleting the review task
                fetch('/reviews/' + this.state.currentRTask["peer-review-for"], {
                    method: 'DELETE',
                    headers: {
                        "Content-type": "application/json"
                    }
                }).then(() => {
                    //Delete the student assignments for a review task after deleting the task
                    fetch('/studentAssignment/' + this.state.currentRTask["peer-review-for"], {
                        method: 'DELETE',
                        headers: {
                            "Content-type": "application/json"
                        }
                    }).then(function (response) {
                        // console.log("specass", _this.state.specAssignments);
                        alert("Task has been deleted");
                        //Remove task from array and change student assignments object to empty
                        _this.state.reviewTasks.splice(taskIndex, 1);
                        _this.state.specAssignments["studentsAssignment"] =[]
                        _this.state.specificReviews = [];
                        _this.setState({
                            isDeleted: true, reviewTasks: _this.state.reviewTasks,
                            specAssignments: _this.state.specAssignments, specificReviews: _this.state.specificReviews
                        });
                        //Display homepage after deletion
                        _this.props.viewHome();
                    });
                });
            });
        }
    }


    // function to handle the view of rubrics. Based on the number of rubrics in array, all rubrics are displayed
    displayRubrics() {
        let rubricsDisplay = this.state.teacherRubrics.map((element, index, array) => {
            //// console.log("displayed for loop", index + 1, "times");
            const criteriaMarkdown = this.state[`criteria${index}`];
            const criteriaHighlighted = <div id="rawHtml" className="language-html">
                <ReactCommonmark source={criteriaMarkdown} />
            </div>


            //return <div key={`index${element}`}>aaa</div>
            return <div key={`divvv${index}`}>
                {/*toggle between edit task screen and task view screen*/}
                {this.state.isTaskEdited ?
                  <Form.Group key={`group${index}`}>
                    <Label content={"Rubric"}/>
                      <Form.Input name={`rubric${index}`}
                                  label='rubric-name' placeholder='rubric-name'
                                  width={8}
                                  disabled={this.state.specificReviews.length > 0}
                                  key={`rubric${index}`}
                                  required
                                  onChange={(e) => this.handleRubricChange(e, element, index)}
                                  value={this.state[`rubric${index}`]}/>
                        <Form.Input name={`point${index}`}
                                    type='number' label='Points' placeholder='Points' width={6}
                                    onChange={(e) => this.handleRubricChange(e, element, index)}
                                    disabled={this.state.specificReviews.length > 0 ||
                                    this.state[`rubric${index}`]=== ""}
                                    key={`point${index}`}
                                    required
                                    value={this.state[`point${index}`]}/>

                        <Form.TextArea name={`criteria${index}`}
                                       label='criteria' placeholder='criteria'
                                       width={12}
                                       disabled={this.state.specificReviews.length > 0 ||
                                       this.state[`rubric${index}`]=== ""}
                                       required
                                       key={`criteria${index}`}
                                       onChange={(e) => this.handleRubricChange(e, element, index)}
                                       value={this.state[`criteria${index}`]}/>
                    <Button basic icon size={"mini"} circular
                            onClick={(e) => this.addRubrics(e)}
                            disabled={!this.state[`point${index}`] ||
                            !this.state[`rubric${index}`] ||
                            !this.state[`criteria${index}`]}>
                        <Icon name='add'/>
                    </Button>
                    {/*<Button basic icon size={"mini"} circular*/}
                    {/*        onClick={(e) => this.deleteRubrics(e,element,index)}*/}
                    {/*        disabled={this.state.rubrics.length === 1}>*/}
                    {/*    <Icon name='delete'/>*/}
                    {/*</Button>*/}
                </Form.Group>
                    /*display normal task view screen*/
            :
                 <Form.Group key={`group${index}`}>
                    <Label content={"Rubric"}/>
                     <Form.Input key={`rubric${index}`}
                                 label='rubric-name'
                                 width={4}
                                 readOnly
                                 value={this.state[`rubric${index}`] || ""}/>
                        <Form.Input key={`point${index}`}
                                    label='Points'
                                    width={3}
                                    readOnly
                                    value={this.state[`point${index}`] || ""}/>

                        <Segment style={{
                            overflow: 'auto',
                            minHeight: 100, maxHeight: 100, maxWidth: 250, minWidth: 250
                        }}
                                 textAlign="left">
                            {criteriaHighlighted}
                        </Segment>


                    {/*<Button basic icon size={"mini"} circular*/}
                    {/*        onClick={(e) => this.deleteRubrics(e,element,index)}*/}
                    {/*        disabled={this.state.rubrics.length === 1}>*/}
                    {/*    <Icon name='delete'/>*/}
                    {/*</Button>*/}
                </Form.Group>
            }
            </div>
        });
        return rubricsDisplay;
    }

    // Display how the students are assigned for peer-review
    displayAssignments(){
        //// console.log("function called");
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
        let submitterId = this.state.specAssignments["studentsAssignment"].map((element,index,array)=>{
            return <Table.Row key={`row${index}`}>
                <Table.Cell key={`cell${index}`}>
                  {element["student"]}
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
                    <Table color={"blue"} celled >
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
        //// console.log("state",this.state);

        // Condition to check if all fields are filled before submit or disable submit button
        let isEnabled = true;
        let count =this.state.reviewRubric.length;
        for(let i=0 ; i<this.state.reviewRubric.length;i++){
            if(this.state.reviewRubric[i]["points-given"] ==="" ||  this.state.reviewRubric[i]["comments"] === ""){
                count = count-1;
            }
        }
        if(count !== this.state.reviewRubric.length){
            isEnabled =false
        }


        // Show all submitter Ids who have submitted assignments for a Homework in a table
        let submittersSet = new Set();
        let students = this.state.specificReviews.map((item,index,array)=>{
            submittersSet.add(item["submitter-id"]);
        });

        let newArray = Array.from(submittersSet);
        //// console.log("newarray",newArray);
        let studentsSubmissions = newArray.map((item,index,array)=>{
            return <Table.Row key={`row${item}`}>
                <Table.Cell key={`submission${item}`}
                            onClick={(event)=>this.handleItemClick(event,item)}
                            active={this.state["student-id"] === item}>
                    {item}
                </Table.Cell>
                    {this.viewPoints(item)}
                </Table.Row>
        });


             let reviewerIds = this.state.reviewDetails.map((review,index,array)=> {
                 // console.log("getting printd");

                     return <Menu.Item
                         name={`ReviewDisplay${index}`}
                         as='a'
                         onClick={(event) => this.handleReviewClick(event, review)}
                         active={review["reviewer-id"] === this.state["reviewer-id"]}
                         key={`ReviewDisplay${review}${index}`}
                     >
                         {review["reviewer-id"]}
                     </Menu.Item>


             });
             // convert markdown instructions to highlighted syntax
        const markdownInstruction = this.state.instructions;
        const highlightedInstruction = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>


        // Dsiplay all points and comments(review details ) of each review
         let data = this.state.reviewRubric.map((item,index,array)=>{
            const comment = item["comments"];
            const rawHtml1 = <div id="rawHtml" className="language-html">
                <ReactCommonmark source={comment} />
            </div>

                return <Table.Row key={`roww${index}${item["rubric-name"]}`}>
                    <Table.Cell key={`rubric${index}${item["rubric-name"]}`}>
                        {item["rubric-name"]}
                    </Table.Cell>
                    <Table.Cell key={`possiblepts${index}${item["rubric-name"]}`}>
                        {item["possible-points"]}
                    </Table.Cell>
                    <Table.Cell key={`pointsGiven${index}${item["rubric-name"]}`}>
                        {/*toggle between edit view and normal view of reviews*/}
                        {this.state.isEdited ?
                            <input type="number"
                                   style={{width: "4em"}}
                                   name={`inputPoint${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`}
                                   required
                                   onChange={(e)=>this.handleEditOneReview(e,item,index)}
                                   key={`inputPoint${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`}
                                   value={item["points-given"] ||
                                   this.state[`inputPoint${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`]}/>
                                   :
                            item["points-given"]
                        }

                    </Table.Cell>
                    <Table.Cell key={`comment${index}${item["rubric-name"]}`}>
                        {this.state.isEdited ?
                            <Input
                                key={`inputComment${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`}
                                name={`inputComment${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`}
                                onChange={(e) => this.handleEditOneReview(e, item, index)}
                                required
                                value={comment ||
                                this.state[`inputComment${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`]}/>
                            :
                            rawHtml1
                        }
                    </Table.Cell>
                </Table.Row>
        });


        return <div style={{marginLeft:10,marginRight:10,  minWidth: 550, marginTop:50}}>
            <Grid stackable>
            <Grid.Column>
                <Grid.Row>
                    <Segment style={{boxShadow:"none"}}>
                        <span><Header  textAlign={"center"} as={"h5"}>
                            {this.state.isTaskEdited ?
                                <Input label={"peer-review-for"} icon={"tag"} name={"peer-review-for"}
                                       value={this.state["peer-review-for"]}
                                       readOnly
                                       onChange={(e)=> this.setState({"peer-review-for":e.target.value})}/>
                                       :

                                <Input label={"peer-review-for"}
                                       value={this.state["peer-review-for"]}
                                       icon={"tag"}
                                readOnly/>
                            }

                        </Header>
                        </span>
                    </Segment>
                </Grid.Row>

                <Grid.Row textAlign={"center"}>
                            <Segment textAlign={"center"}>
                                <Form centered={"true"}>
                                    <Form.Field inline required>
                                        <Label icon='calendar alternate' content="Due"/>
                                        {this.state.isTaskEdited ?
                                            <DatePicker
                                                selected={this.state.due}
                                                onChange={date => this.setState({due:date})}
                                                showTimeSelect
                                                timeFormat="p"
                                                timeIntervals={15}
                                                dateFormat="Pp"
                                            />
                                            :
                                            new Date(this.state.due).toLocaleString()
                                        }
                                    </Form.Field>
                                    <Form.Field inline required>
                                        <Label>General Instructions</Label>
                                        {this.state.isTaskEdited ?
                                            <TextArea
                                                style={{minHeight: 100, minWidth: 200, maxHeight: 100, maxWidth: 300,}}
                                                name={"instructions"}
                                                required
                                                value={this.state.instructions}
                                                onChange={(e) => {
                                                    this.handleEachChange(e)
                                                }}/>
                                            :

                                            <Segment style={{overflow: 'auto', marginLeft:"25em",
                                                minHeight:300,maxHeight:300,maxWidth:600,minWidth:200 }}
                                                     textAlign="left">
                                                {highlightedInstruction}
                                            </Segment>

                                        }
                                    </Form.Field>


                                    <Grid textAlign={"center"}>
                                        <Grid.Column width={8}>
                                            {this.displayRubrics()}
                                        </Grid.Column>
                                    </Grid>


                                <Button onClick={(e)=>this.handleEditTaskDetails(e)} color={"blue"}
                                        disabled={this.state.isTaskEdited}>Edit this task</Button>
                                <Button onClick={(e)=>this.handleEditTask(e)} color={"teal"}
                                        disabled={!this.state.isTaskEdited}>Save task details!</Button>
                                <Button onClick={(e)=>this.handleDeleteTask(e)} color={"red"}> Delete task</Button>
                                    {this.displayAssignments()}
                                    {/*Display confirm dialog box when edit button is clicked*/}
                                <Confirm
                                    open={this.state.open}
                                    onCancel={this.handleCancel}
                                    onConfirm={this.handleConfirm}
                                />

                        </Form>
                            </Segment>


                </Grid.Row>
                <Grid.Row>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={5}>
                                {this.viewContents()}
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Table color={"teal"}>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Student Ids submitted</Table.HeaderCell>
                                            <Table.HeaderCell colSpan={3}>Review total points</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {/*Display all submitter ids for an assignment*/}
                                        {studentsSubmissions}
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                {/*Display all reviewer ids for each submitter*/}
                                <Segment style={{overflow: 'auto',minHeight:300,maxHeight:400,maxWidth:3000,minWidth:400 }}>
                                <Menu pointing secondary>
                                    {reviewerIds}
                                </Menu>
                                    {/*Display all review details for each review*/}
                                {this.state.viewReviews === true ?
                                    <div>
                                  <Table color={"blue"}>
                                    <Table.Header>
                                    <Table.Row>
                                    <Table.HeaderCell>Rubric name</Table.HeaderCell>
                                    <Table.HeaderCell>Possible pts</Table.HeaderCell>
                                    <Table.HeaderCell>Points given</Table.HeaderCell>
                                    <Table.HeaderCell>Comments</Table.HeaderCell>
                                    </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {/*Display all details of reviews*/}
                                    {data}
                                    </Table.Body>
                                    </Table>
                                    <span><Button onClick={(e)=>this.handleEditReviews(e)} color={"blue"}
                                    disabled={this.state.isEdited}>Edit review</Button> </span>
                                    <span><Button onClick={(e)=>this.handleSaveReviews(e)} color={"teal"}
                                    disabled={!this.state.isEdited || !isEnabled}>Save review</Button> </span>
                                    </div>
                                    /*tif a reviewer id is not clicked, display this*/
                                    :
                                    <div>Click on a Reviewer id</div>

                                }
                                </Segment>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Row>
            </Grid.Column>
        </Grid>
        </div>

    }


}