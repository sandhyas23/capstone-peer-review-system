import React from 'react';
import {Button, Grid, Icon, Label} from 'semantic-ui-react'
import TaskCreator from "./taskCreator";


export default class TaskViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tasks: this.props.tasks, currentTask: this.props.currentTask,  mode:this.props.mode };
    }

    addQuestion(){
        this.setState({mode:"add"})
    }

    showQuestions(){
        if(this.state.mode ==="add"){
            return<TaskCreator tasks={this.state.tasks} mode={this.state.mode} currentTask={this.state.currentTask}/>
        }
        else{

        }
    }


    render() {


        return <div>

                <Grid columns={2} relaxed='very' divided='vertically'>
                    <Grid.Row columns={2}>
                    <Grid.Column>
                        <Button onClick = {()=> this.addQuestion()}> Add Question </Button>
                    </Grid.Column>
                    <Grid.Column>
                        {this.showQuestions()}
                    </Grid.Column>
                    </Grid.Row>
                </Grid>

        </div>
    }

}

