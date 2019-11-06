import React from 'react';
import {
    Icon,
    Grid,
    Table,
    Header,
    Segment
} from 'semantic-ui-react';


import Prism from "prismjs";
import ReactCommonmark from "react-commonmark";



export default class StudentSubmissionSummary extends React.Component{
    constructor(props){
        super(props);
        this.state = {specificSubmissions:props.specificSubmissions, currentSTask:props.currentSTask, content:"kkk" }

    }

    static getDerivedStateFromProps(props,state){
        if(props === state){
            return null;
        }
        else{
            return {currentSTask:props.currentSTask ,specificSubmissions:props.specificSubmissions}
        }

    }
    componentDidUpdate() {
        Prism.highlightAll();

    }
    componentDidMount() {
        Prism.highlightAll();
    }

    handleClick(event,item){
        //console.log(item["content"]);
        this.setState({content:item["content"]});
    }
    viewContent(){
        const markdownInstruction = this.state.content;
        const rawHtml = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>
        return <Segment style={{overflow: 'auto',minHeight:500,maxHeight:330,maxWidth:1000,minWidth:200 }}>
            {rawHtml}
        </Segment>
    }

    render(){
       let students = this.state.specificSubmissions.map((item,index,array)=>{
           return <Table.Row key={`row${item["netId"]}`}><Table.Cell key={`submission${item["netId"]}`}
           onClick={(event)=>this.handleClick(event,item)}>
               {item["netId"]}
           </Table.Cell>
           </Table.Row>
       })


        return <Grid stackable>
            <Grid.Column>
                <Grid.Row>
                    <Segment style={{boxShadow:"none"}}>
                        <span><Header  textAlign={"center"} as={"h4"}>
                            <Icon name='tag'/>
                            {this.state.currentSTask["task-name"]}
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
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {students}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        {this.viewContent()}
                    </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Row>
            </Grid.Column>

        </Grid>
    }
}