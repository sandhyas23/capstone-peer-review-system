import React from 'react';
import {Menu, Sidebar, Icon, Grid, Container} from 'semantic-ui-react';
import tasks from './tasks1.json'
import TaskSubmit from "./taskSubmit";
import TaskReview from "./taskReview"

//import TaskReview from "./taskReview"


export default class StudentView extends React.Component{
    constructor(props){
        super(props);
        this.state = {tasks:tasks , mode:"" }

    }

    handleOpenItemClick(event, task){
       // console.log("taskclicked" +task["task-name"]);
        this.setState({mode:"submit", currentTask:task})
        //console.log("ccc",this.state.currentTask);
    }

    handleClosedItemClick(event, task){
        //console.log("taskclicked" +task["task-name"]);
        this.setState({mode:"review", currentTask:task})
        //console.log("ddd",this.state.currentTask);
    }

    handleViewComponent(){
        const viewMode = this.state.mode;
        if(viewMode === "submit"){
            //console.log("cliked" +this.state.currentTask["task-name"]);
            return <TaskSubmit currentTask = {this.state.currentTask} netId={this.props.netId}/>


        }
        else if(viewMode === "review"){
           // console.log("cliked" +this.state.currentTask["task-name"]);
            return <TaskReview currentTask = {this.state.currentTask} netId={this.props.netId}/>
        }
        else{

        }
    }

    render(){

        let openTaskItems = this.state.tasks.map((task , index , array) => {
            if(task["status"] === "open"){
                return <Menu.Item
                    name={task["task-name"]}
                    key = {`otask${index}`}
                    onClick={(event) => this.handleOpenItemClick(event,task)}
                >
                    <span>
                        <Icon name ="tag" />
                        {task["task-name"]}
                    </span>
                </Menu.Item>

            }
        });

        let closedTaskItems = this.state.tasks.map((task , index , array) => {
            if(task["status"] === "closed"){
                return <Menu.Item
                    name={task["task-name"]}
                    key = {`ctask${index}`}
                    onClick={(event) => this.handleClosedItemClick(event,task)}
                >
                    <span>
                        <Icon name ="tag" />
                        {task["task-name"]}
                    </span>
                </Menu.Item>

            }
        });
    return<div>
        <div>
        <Sidebar
            as={Menu}
            animation='push'
            direction='left'
            icon='labeled'
            inverted
            visible={true}
            vertical
            width='thin'


        >
            <Menu.Item>
                <Icon name ="tasks"></Icon><Menu.Header>Tasks to submit</Menu.Header>
                <Menu.Menu>
                    {openTaskItems}
                </Menu.Menu>
            </Menu.Item>

            <Menu.Item>
                <Icon name ="tasks"></Icon><Menu.Header>Tasks to Review</Menu.Header>

                <Menu.Menu>
                    {closedTaskItems}
                </Menu.Menu>
            </Menu.Item>

            <Menu.Item>
                <Icon name ="tasks"></Icon><Menu.Header>Reviewed tasks</Menu.Header>

                <Menu.Menu>
                    <Menu.Item
                        name='shared'

                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='dedicated'

                        onClick={this.handleItemClick}
                    />
                </Menu.Menu>
            </Menu.Item>
        </Sidebar>
        </div>
        <Menu fixed='top' stackable inverted>
            <Container>
                <Menu.Item as='h4'
                           header
                           position={"right"} >
                    Peer Review System
                </Menu.Item>
                <Menu.Item
                    as='a'
                    position={"right"}
                >{`Welcome, ${this.props.netId}`}</Menu.Item>
                <Menu.Item
                    as='a'
                    position={"right"}
                    margin-right={"150px"}
                >Logout</Menu.Item>
            </Container>
        </Menu>


        <div style={{marginLeft: 170, minWidth: 550, marginTop:50}}>
        <Grid padded  stackable>

            <Grid.Column >

            {this.handleViewComponent()}

               </Grid.Column>

        </Grid>
    </div>

    </div>

    }
}
