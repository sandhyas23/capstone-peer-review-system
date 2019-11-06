import React from 'react';
import {
    Menu,
    Icon,
    Grid,
    Header,
    Segment,
    Table
} from 'semantic-ui-react';

import Prism from "prismjs";
import ReactCommonmark from "react-commonmark";



export default class StudentReviewSummary extends React.Component{
    constructor(props){
        super(props);
        this.state = {specificReviews:props.specificReviews, currentRTask:props.currentRTask ,content:"bbb",
                      specSubmissions:props.specSubmissions, reviewDetails:[],rubric:[]}

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
                    {item["possible-pts"]}
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
                            <Icon name='tag'/>
                            {this.state.currentRTask["peer-review-for"]}
                        </Header>
                        </span>
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