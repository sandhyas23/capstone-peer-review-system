import React from 'react';
import Prism from 'prismjs';
import ReactCommonmark from 'react-commonmark';
import submissions from '../data/submissionsHw';
import 'prismjs/themes/prism-coy.css';
import {Grid, Segment, Header, Label, Icon, Form, Input, TextArea, Button, Modal, Menu, Table} from "semantic-ui-react";


export default class ViewReviewed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTask: this.props.currentTask, reviews: this.props.reviews, netId: this.props.netId,
            "assignment-name": this.props.currentTask["peer-review-for"], content: "",
            theInputKey: "", fileName: "", rubric:[],
            submissions:props.submissions
        }
        //console.log(this.state.newTask);
    }

    static getDerivedStateFromProps(props,state){
        if(props.currentTask === state.currentTask){
            return null;
        }
        else{
            return {
                currentTask: props.currentTask , reviews:props.reviews,
                "assignment-name":props.currentTask["peer-review-for"],rubric:[],
                submissions:props.submissions,
                content: ""
            }
        }
    }

    componentDidUpdate() {
        Prism.highlightAll();

    }

    componentDidMount() {
        Prism.highlightAll();


    }

    handleItemClick(event,review){
        this.setState({rubric:review["review"]["rubric"], "reviewer-id":review});
    }


    render() {
        let mySubmission =  this.state.submissions.find((item,index,array)=>{
            return item["netId"] === this.state.netId && item["assignment-name"]=== this.state["assignment-name"]
        });
        let content =""

        if(typeof mySubmission !== "undefined") {
            const content = mySubmission["content"];
        }

        let reviewsToPost;
        console.log("content in state", this.state);

        let currentReview = this.state.reviews.filter((review,index,array)=>{
            return review["assignment-name"] === this.state["assignment-name"] &&
                review["submitter-id"] === this.state.netId;
        });
        console.log("aaaa",currentReview);


            reviewsToPost = currentReview.map((review, index, array) => {

                //console.log("printed this",count+1,"times");
                return <Menu.Item
                    name={`Review${index}`}
                    as='a'
                    onClick={(event) => this.handleItemClick(event, review)}
                    key={`Review${review}${index}`}
                    active={review=== this.state["reviewer-id"]}
                >
                    {`Review${index}`}
                </Menu.Item>
            });


        const markdownInstruction = content;
        const rawHtml = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>

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


        return  <Grid  stackable>

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

                                    <Input readOnly style={{color:"red"}}>Closed</Input>
                                </Form.Field>
                            </Form.Group>
                        </Segment>
                    </Form>

                </Grid.Row>

                <Header  textAlign={"center"} as={"h4"}>
                    <Icon name='code'/>
                    View Reviews for my assignments
                </Header>
                <span> <Modal className={"modal1"} trigger={<Button>View Rubrics</Button>}>

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
                            <hr/>
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
                        {/*enter review*/}
                        <Grid.Column width={8}>



                            <Segment style={{overflow: 'auto',minHeight:330,maxHeight:330,maxWidth:500,minWidth:200 }}
                                     textAlign="left">

                                {rawHtml}
                            </Segment>
                        </Grid.Column>
                    </Grid>
                </Grid.Row>


            </Grid.Column>
        </Grid>
    }
}
