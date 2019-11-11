import React from 'react';
import {
    Menu,
    Icon,
    Grid,
    Header,
    Segment,
    Table, Input, Form, Label, Select, Button, Modal
} from 'semantic-ui-react';

import Prism from "prismjs";
import ReactCommonmark from "react-commonmark";
import DatePicker from "react-datepicker";



export default class StudentReviewSummary extends React.Component{
    constructor(props){
        super(props);
        this.state = {specificReviews:props.specificReviews, currentRTask:props.currentRTask ,content:"bbb",
                      specSubmissions:props.specSubmissions, reviewDetails:[],rubric:[],
            "peer-review-for":props.currentRTask["peer-review-for"], status:props.currentRTask["status"] ,
            due:new Date(props.currentRTask["due"]), specAssignments:props.specAssignments}

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
        Prism.highlightAll();

    }
    componentDidMount() {
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
        this.setState({content:content["content"] , reviewDetails:reviewDetails});
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
        this.setState({"rubric": review["review"]["rubric"]});

    }

    handleEditTask(e){
        const _this= this;
        let reviewTask = {
            "peer-review-for": this.state["peer-review-for"], status: this.state.status,
            due: this.state.due.toISOString()
        };
        fetch('/reviewTask/'+this.state.currentRTask["peer-review-for"], {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(reviewTask)
        }).then(function (response) {
            //_this.state.submissions.push(addTask);
            _this.setState({});
            // console.log("submitted",this.state.submissions);
            // console.log(this.state.submissions);
            _this.props.update();
            // event.preventDefault();
        });
    }

    handleDeleteTask(){
        const _this= this;
        fetch('/ReviewTask/'+this.state.currentRTask["peer-review-for"], {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json"
            }
        }).then(function (response) {
            //_this.state.submissions.push(addTask);
            _this.setState({});
            // console.log("submitted",this.state.submissions);
            // console.log(this.state.submissions);
            _this.props.update();
            // event.preventDefault();
        });
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
        let submittersSet = new Set();
        let students = this.state.specificReviews.map((item,index,array)=>{
            submittersSet.add(item["submitter-id"]);
        });

        let newArray = Array.from(submittersSet);
        //console.log("newarray",newArray);

        let studentsSubmissions = newArray.map((item,index,array)=>{
            return <Table.Row key={`row${item}`}>
                <Table.Cell key={`submission${item["submitter-id"]}`}
                            onClick={(event)=>this.handleItemClick(event,item)}>
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
                key={`ReviewDisplay${review}${index}`}
            >
                {review["reviewer-id"]}
            </Menu.Item>

        });



        let data = this.state.rubric.map((item,index,array)=>{
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
                    {item["points-given"]}
                </Table.Cell>
                <Table.Cell key={`comment${index}${item["rubric-name"]}`}>
                    {rawHtml1}
                </Table.Cell>
            </Table.Row>
        });

        return <Grid stackable>
            <Grid.Column>
                <Grid.Row>
                    <Segment style={{boxShadow:"none"}}>
                        <span><Header  textAlign={"center"} as={"h4"}>
                            <Input label={"peer-review-for"} size='small' icon={"pencil"} name={"peer-review-for"}
                                   value={this.state["peer-review-for"]}
                                   onChange={(e)=> this.setState({"peer-review-for":e.target.value})}/>
                        </Header>
                        </span>
                    </Segment>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        <Form centered={"true"}>
                            <Segment textAlign={"center"}>
                                <Form.Group centered={"true"} widths='equal'>
                                    <Form.Field inline>
                                        <Label icon='calendar alternate' content="Due"/>
                                        <DatePicker
                                            selected={this.state.due}
                                            onChange={date => this.setState({due:date})}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="Pp"
                                        />
                                    </Form.Field>
                                    <Form.Field inline>
                                        <Label icon='lock open' content="Status"/>
                                        <Select placeholder='Select the status'
                                                name="status"
                                                value={this.state.status}
                                                options={[
                                                    { key: 'hw1', text: 'Open', value: 'open' },
                                                    { key: 'hw2', text: 'Closed', value: 'closed' },

                                                ]} onChange={(e,data)=> this.setState({[data.name]: data.value})}/>
                                    </Form.Field>
                                    <Button onClick={(e)=>this.handleEditTask(e)}>Save task details!</Button>
                                    <Button onClick={(e)=>this.handleDeleteTask(e)}> Delete task</Button>
                                </Form.Group>

                            </Segment>
                        </Form>
                    </Grid.Column>

                </Grid.Row>
                <Grid.Row>
                    {this.displayAssignments()}
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
                                <Menu pointing secondary>
                                    {something}
                                </Menu>
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
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Row>
            </Grid.Column>

        </Grid>

    }


}