import React from 'react';
import { Dropdown,Icon } from 'semantic-ui-react'
import tasks from './tasks1.json';
import TaskViewer from "./taskViewer";


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tasks: tasks, currentTask:"", mode:"none" };
    }
    // componentDidMount(){
    //     let _this = this;
    //     _this.setState({sampleTasks: tasks});
    // }

    showTask(eventKey,data) {
        this.setState({mode:"view", currentTask: data.text});
        console.log("dksdsd" +data.text);
        console.log(data.text);

    }

    showQuestions(){
        const isTask = this.state.mode;
        if (isTask === "view") {
            return <TaskViewer tasks={this.state.tasks}  currentTask ={this.state.currentTask} mode={this.state.mode} />
        }
        else{
            return <div>

            </div>
        }

    }

    render() {
        let listItems =  this.state.tasks.map((task, index, array) => {
            return <Dropdown.Item text = {task["task-name"]} key = {`task${index}`} onClick = {(eventKey,data) => this.showTask(eventKey,data)}
                                   value={task["task-name"]}/>

        });

        return  <div>
            <Icon name='tag' />
            <Dropdown text={"TaskID"} >
                <Dropdown.Menu>
            {listItems}
            </Dropdown.Menu>
            </Dropdown>
            {this.showQuestions()}
        </div>


    }
}

