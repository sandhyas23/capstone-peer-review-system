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
import Prism from "prismjs";
import ReactCommonmark from "react-commonmark";
import DatePicker from "react-datepicker";



export default class StudentReviewSummary extends React.Component{
    constructor(props){
        super(props);
        this.state = {specificReviews:props.specificReviews, currentRTask:props.currentRTask ,content:"bbb",
                      specSubmissions:props.specSubmissions, reviewDetails:[],reviewRubric:[],
            "peer-review-for":props.currentRTask["peer-review-for"],
            due:new Date(props.currentRTask["due"]), specAssignments:props.specAssignments,
            teacherRubrics:props.currentRTask["rubric"],
        open:false, reviewTasks:props.reviewTasks,isDeleted:false,isEdited:false,isTaskEdited:false,isSaved:false,
        instructions:props.currentRTask["instructions"]}

    }

    static getDerivedStateFromProps(props,state){
        if(props === state){
            return null;
        }
        else{
            return {currentRTask:props.currentRTask ,specificReviews:props.specificReviews,
                specSubmissions:props.specSubmissions
                }
        }

    }
    componentDidUpdate() {
       console.log("updated component");
        Prism.highlightAll();

    }
    componentDidMount() {
        let rubricsDisplay = this.state.currentRTask["rubric"].map((element, index, array) => {
            //console.log("displayed for loop", index + 1, "times");

            this.setState({
                [`point${index}`]: element["points"],
                [`rubric${index}`]: element["rubric-name"],
                [`criteria${index}`]: element["criteria"],
            });
        });

        let reviewsDisplay = this.state.specificReviews.map((element,index,array)=>{
            element["review"]["rubric"].map((item,ind,arr)=>{
                console.log("elementin mount",element);
                this.setState({
                    [`inputPoint${item["rubric-name"]}${element["submitter-id"]}${element["reviewer-id"]}`]: item["points-given"],
                    [`inputComment${item["rubric-name"]}${element["submitter-id"]}${element["reviewer-id"]}`]: item["comments"]

                });
            });
        })

        Prism.highlightAll();
    }

    viewPoints(item){

            let cc = this.state.specificReviews.filter((element ,index,array)=>{
                return element["submitter-id"] === item
            });
            let ca = cc.map((element,index,array)=>{
                //console.log(element["total-points"]);
                return <Table.Cell key={`review${element["reviewer-id"]}`}>
                    {element["review"]["total-points"]}
                </Table.Cell>
            });
            return ca;
        }



    handleItemClick(event,item){
        //console.log("specific",this.state.specSubmissions);
        let content = this.state.specSubmissions.find((element,index,array)=>{
            //console.log(element["assignment-name"]);
            return element["netId"] === item;
        });

        let reviewDetails = this.state.specificReviews.filter((element,index,array)=>{
            return element["submitter-id"] === item;

        });
        console.log("reviewDetails",reviewDetails);

        //console.log("content",content)
        this.setState({content:content["content"] , reviewDetails:reviewDetails,"student-id":item,
            viewReviews:false, "reviewer-id":""});
    }

    viewContents(){
        const markdownInstruction = this.state.content;
        const rawHtml = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>
        return <Segment style={{overflow: 'auto',minHeight:500,maxHeight:330,maxWidth:1000,minWidth:150 }}>
            {rawHtml}
        </Segment>
    }

    handleReviewClick(event,review){


        this.setState({"reviewRubric": review["review"]["rubric"], "reviewer-id":review["reviewer-id"],
                     viewReviews:true
        });

    }

    addRubrics(e) {
        this.state.teacherRubrics.push({"points": "", "rubric-name": "",
            "criteria": ""});
        //let lastElement = this.state.rubricIds[this.state.rubricIds.length-1];
        this.setState({teacherRubrics: this.state.teacherRubrics});
    }

    handleEditReviews(e){
        this.setState({isEdited:true});
    }
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

        // console.log(element);
        // this.state.rubric.splice(index,1);
        // let i = this.state.rubricIds.indexOf(element);
        // this.state.rubricIds.splice(i,1);
        // if(i > -1){
        //     this.setState({[`point${element}`]:undefined, [`rubric${element}`]:undefined,
        //         [`criteria${element}`]:undefined,rubric:this.state.rubric,rubricIds:this.state.rubricIds});
        // }
        //console.log("deleted", this.state.rubricIds);

    //}

    handleRubricChange(e,element,index) {
        this.handleEachChange(e).then(() => {

            let rubric_task = {
                "rubric-name": this.state[`rubric${index}`],
                "points": this.state[`point${index}`],
                "criteria": this.state[`criteria${index}`],
            }
            this.state.teacherRubrics.splice(index, 1, rubric_task);
            this.setState({
                teacherRubrics: this.state.teacherRubrics,
            });
        });
    }

    handleEditTask(e){
        let taskIndex = this.state.reviewTasks.findIndex((item,index,arry)=>{
            return item["peer-review-for"] === this.state["peer-review-for"];
        });
        const _this= this;
        let reviewTask = {
            "peer-review-for": this.state["peer-review-for"],
            due: this.state.due.toISOString(),rubric:this.state.teacherRubrics,
            instructions:this.state.instructions
        };
        let studentAssign =  this.state.specAssignments;
        fetch('/reviewTask/'+this.state.currentRTask["peer-review-for"], {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(reviewTask)
        }).then(()=>{
            fetch('/studentAssignment/'+this.state.currentRTask["task-name"], {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(studentAssign)
            }).then(function (response) {
                console.log("inside this");
                 //_this.state.reviewTasks.splice(taskIndex,1,reviewTask);
                 //_this.setState({reviewTasks:_this.state.reviewTasks,isEdited:false});
                _this.props.update();
            })
        }).then(function (response) {
            //_this.state.submissions.push(addTask);
            _this.state.reviewTasks.splice(taskIndex,1,reviewTask);
            _this.setState({isTaskEdited:false,reviewTasks:_this.state.reviewTasks,});
            // event.preventDefault();
        });
    }

    handleEachChange = async(e,rubrics,index) =>{

        const target = e.target;
        const value = target.value;
        const name = target.name;
        // console.log("event:",e, "target",target);


        this.setState({
            [name]:value
        });


    }

    handleEditOneReview(e,item,index){


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

    handleSaveReviews(e){
        let totalPoints =0;
        this.state.reviewRubric.map((item,index,array)=>{
            return totalPoints +=  parseInt(item["points-given"]);
        });

        let reviewIndex = this.state.specificReviews.findIndex((element)=>{
            return element["reviewer-id"] === this.state["reviewer-id"] && element["submitter-id"] === this.state["student-id"];
        })

        const _this= this;
        let editedReviews = {
            "assignment-name": this.state["peer-review-for"], "reviewer-id": this.state["reviewer-id"],
            "submitter-id":this.state["student-id"],
            review:{"total-points":totalPoints, "general-comments":"", rubric:this.state.reviewRubric}
        };

        fetch('/reviews/'+this.state["peer-review-for"]+'/reviewer/'+this.state["reviewer-id"]+'/submitter/'+this.state["student-id"]
            , {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(editedReviews)
            }).then(function (response) {
            _this.state.specificReviews.splice(reviewIndex,1,editedReviews);
            _this.setState({
                specificReviews:_this.state.specificReviews, isEdited:false
            });
        });


    }




    handleDeleteTask(){

        this.setState({ open: true })

    }


    handleCancel =() =>{
        this.setState({open:false})
    }

    handleConfirm = ()=> {
        let taskIndex = this.state.reviewTasks.findIndex((item,index,arry)=>{
            return item["peer-review-for"] === this.state["peer-review-for"];
        });
        const _this= this;
        fetch('/ReviewTask/'+this.state.currentRTask["peer-review-for"], {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json"
            }
        }).then(function (response) {

            _this.setState({open:false});
            _this.props.update();

        }).then(()=> {
            fetch('/reviews/' + this.state.currentRTask["task-name"], {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json"
                }
            }).then(() => {
                fetch('/studentAssignment/' + this.state.currentRTask["task-name"], {
                    method: 'DELETE',
                    headers: {
                        "Content-type": "application/json"
                    }
                }).then(function (response) {
                    console.log("inside this");
                    _this.state.reviewTasks.splice(taskIndex, 1);
                    _this.state.specAssignments.pop()
                    _this.setState({isDeleted: true, reviewTasks: _this.state.reviewTasks,
                        specAssignments:_this.state.specAssignments});
                });
            });
        });
    }



    displayRubrics() {
        let rubricsDisplay = this.state.teacherRubrics.map((element, index, array) => {
            //console.log("displayed for loop", index + 1, "times");
            const criteriaMarkdown = this.state[`criteria${index}`];
            const criteriaHighlighted = <div id="rawHtml" className="language-html">
                <ReactCommonmark source={criteriaMarkdown} />
            </div>


            //return <div key={`index${element}`}>aaa</div>
            return <div key={`divvv${index}`}>
                {this.state.isTaskEdited ?
                  <Form.Group key={`group${index}`}>
                    <Label content={"Rubric"}/>
                      <Form.Input name={`rubric${index}`}
                                  label='rubric-name' placeholder='rubric-name'
                                  width={8}
                                  disabled={this.state.specificReviews.length > 0}
                                  key={`rubric${index}`}
                                  onChange={(e) => this.handleRubricChange(e, element, index)}
                                  value={this.state[`rubric${index}`]}/>
                        <Form.Input name={`point${index}`}
                                    type='number' label='Points' placeholder='Points' width={6}
                                    onChange={(e) => this.handleRubricChange(e, element, index)}
                                    disabled={this.state.specificReviews.length > 0 ||
                                    this.state[`rubric${index}`]=== ""}
                                    key={`point${index}`}
                                    value={this.state[`point${index}`]}/>

                        <Form.TextArea name={`criteria${index}`}
                                       label='criteria' placeholder='criteria'
                                       width={12}
                                       disabled={this.state.specificReviews.length > 0 ||
                                       this.state[`rubric${index}`]=== ""}
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
            :
                 <Form.Group key={`group${index}`}>
                    <Label content={"Rubric"}/>
                     <Form.Input key={`rubric${index}`}
                                 label='rubric-name'
                                 width={4}
                                 readOnly
                                 value={this.state[`rubric${index}`]}/>
                        <Form.Input key={`point${index}`}
                                    label='Points'
                                    width={3}
                                    readOnly
                                    value={this.state[`point${index}`]}/>

                        <Segment style={{
                            overflow: 'auto',
                            minHeight: 100, maxHeight: 100, maxWidth: 250, minWidth: 250
                        }}
                                 textAlign="left">
                            {criteriaHighlighted}
                        </Segment>

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
            }
            </div>
        });
        return rubricsDisplay;
    }


    displayAssignments(){
        //console.log("function called");
        function bb(element){
            let cq = element["reviewers"].map((item,index,array)=>{
                return <Table.Cell key={`cell2${index}`}>
                    {item}

                </Table.Cell>

            });
            return cq;
        }



        let cc = this.state.specAssignments["studentsAssignment"].map((element,index,array)=>{
            return <Table.Row key={`row${index}`}>
                <Table.Cell key={`cell${index}`}>
                  {element["student"]}
                </Table.Cell>
                {bb(element)}
            </Table.Row>
        });



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
                            {cc}
                        </Table.Body>
                    </Table>

                </Modal.Description>
            </Modal.Content>

        </Modal>
    }





    render(){
        console.log("state",this.state);
        let submittersSet = new Set();
        let students = this.state.specificReviews.map((item,index,array)=>{
            submittersSet.add(item["submitter-id"]);
        });

        let newArray = Array.from(submittersSet);
        //console.log("newarray",newArray);

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


             let something = this.state.reviewDetails.map((review,index,array)=> {

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

        const markdownInstruction = this.state.instructions;
        const highlightedInstruction = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>




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
                        {this.state.isEdited ?
                            <input type="number"
                                   style={{width: "4em"}}
                                   name={`inputPoint${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`}
                                   onChange={(e)=>this.handleEditOneReview(e,item,index)}
                                   key={`inputPoint${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`}
                                   value={item["points-given"] ||
                                   this.state[`inputPoint${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`]}/>
                                   :
                            item["possible-points"]
                        }

                    </Table.Cell>
                    <Table.Cell key={`comment${index}${item["rubric-name"]}`}>
                        {this.state.isEdited ?
                            <Input
                                key={`inputComment${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`}
                                name={`inputComment${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`}
                                onChange={(e) => this.handleEditOneReview(e, item, index)}
                                value={comment ||
                                this.state[`inputComment${item["rubric-name"]}${this.state["student-id"]}${this.state["reviewer-id"]}`]}/>
                            :
                            rawHtml1
                        }
                    </Table.Cell>
                </Table.Row>
        });


        if(this.state.isDeleted){
            return <div>Home page</div>
        }


        return <div style={{marginLeft:10,marginRight:10,  minWidth: 550, marginTop:50}}>
            <Grid stackable>
            <Grid.Column>
                <Grid.Row>
                    <Segment style={{boxShadow:"none"}}>
                        <span><Header  textAlign={"center"} as={"h4"}>
                            {this.state.isTaskEdited ?
                                <Input label={"peer-review-for"} size='small' icon={"pencil"} name={"peer-review-for"}
                                       value={this.state["peer-review-for"]}
                                       disabled={this.state.specificReviews.length >0}
                                       onChange={(e)=> this.setState({"peer-review-for":e.target.value})}/>
                                       :

                                <Input label={"peer-review-for"}
                                       value={this.state["peer-review-for"]}
                                readOnly/>
                            }

                        </Header>
                        </span>
                    </Segment>
                </Grid.Row>

                <Grid.Row textAlign={"center"}>
                            <Segment textAlign={"center"}>
                                <Form centered={"true"}>
                                    <Form.Field inline>
                                        <Label icon='calendar alternate' content="Due"/>
                                        {this.state.isTaskEdited ?
                                            <DatePicker
                                                selected={this.state.due}
                                                onChange={date => this.setState({due: date})}
                                                showTimeSelect
                                                timeFormat="p"
                                                timeIntervals={15}
                                                dateFormat="Pp"
                                            />
                                            :
                                            new Date(this.state.due).toLocaleString()
                                        }
                                    </Form.Field>
                                    <Form.Field inline>
                                        <Label>General Instructions</Label>
                                        {this.state.isTaskEdited ?
                                            <TextArea
                                                style={{minHeight: 100, minWidth: 200, maxHeight: 100, maxWidth: 300,}}
                                                name={"instructions"}
                                                value={this.state.instructions}
                                                onChange={(e) => {
                                                    this.handleEachChange(e)
                                                }}/>
                                            :

                                            <Segment style={{overflow: 'auto', marginLeft:"20em",
                                                minHeight:330,maxHeight:330,maxWidth:600,minWidth:200 }}
                                                     textAlign="left">
                                                {highlightedInstruction}
                                            </Segment>

                                        }
                                    </Form.Field>


                                    <Grid textAlign={"center"}>
                                        <Grid.Column width={10}>
                                            {this.displayRubrics()}
                                        </Grid.Column>
                                    </Grid>


                                <Button onClick={(e)=>this.handleEditTaskDetails(e)}
                                        disabled={this.state.isTaskEdited}>Edit this task</Button>
                                <Button onClick={(e)=>this.handleEditTask(e)}
                                        disabled={!this.state.isTaskEdited}>Save task details!</Button>
                                <Button onClick={(e)=>this.handleDeleteTask(e)}> Delete task</Button>
                                    {this.displayAssignments()}
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
                            <Grid.Column width={4}>
                                <Table>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Student Ids submitted</Table.HeaderCell>
                                            <Table.HeaderCell colSpan={3}>Reviews</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {studentsSubmissions}
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                            <Grid.Column width={7}>
                                {this.viewContents()}
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Segment style={{overflow: 'auto',minHeight:300,maxHeight:400,maxWidth:2000,minWidth:300 }}>
                                <Menu pointing secondary>
                                    {something}
                                </Menu>
                                {this.state.viewReviews === true ?
                                  <Table>
                                    <Table.Header>
                                    <Table.Row>
                                    <Table.HeaderCell>Rubric name</Table.HeaderCell>
                                    <Table.HeaderCell>Possible pts</Table.HeaderCell>
                                    <Table.HeaderCell>Points given</Table.HeaderCell>
                                    <Table.HeaderCell>Comments</Table.HeaderCell>
                                    </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                    {data}
                                        <Button onClick={(e)=>this.handleEditReviews(e)}
                                        disabled={this.state.isEdited}>Edit this review</Button>
                                        <Button onClick={(e)=>this.handleSaveReviews(e)}
                                        disabled={!this.state.isEdited}>Save this review</Button>
                                    </Table.Body>
                                    </Table>
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