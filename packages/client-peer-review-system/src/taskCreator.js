import React from 'react';
import {Button, Icon, Form, TextArea, Label, List} from 'semantic-ui-react';
import tasks from './tasks1.json';


export default class TaskCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: tasks, mode: this.props.mode, currentTask: this.props.currentTask,
            questions: "", answer: ""
        };
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });

        console.log("eventname" + name);
    }

    handleSubmit(event) {
        let taskIndex = this.state.tasks.findIndex((currentValue) => {
            return currentValue["task-name"] === this.state.currentTask;
        });
        console.log(taskIndex);
        let tasktoSave = this.state.tasks[taskIndex];
        let quest = {questions: this.state.questions, answer: this.state.answer};
        tasktoSave["instructions"].push(quest);
        console.log("sandhya" + quest.questions);


        console.log("submit" + tasktoSave["instructions"].questions);
        this.setState({mode: this.props.mode});
        event.preventDefault();

    }
    // Todo: define function
    handleDelete() {

    }

    render() {

        let taskIndex = this.state.tasks.findIndex((currentValue) => {
            return currentValue["task-name"] === this.state.currentTask;
        });
        console.log(taskIndex);
        let taskw = this.state.tasks[taskIndex];
        let aaa = taskw["instructions"].map((instruction, index, array) => {
            //console.log("instr"+instruction);
            return <List.Item key={`question${index}`}>
                {instruction.questions} <span>
                <Label onRemove={this.handleDelete()}>
                    <Icon name='delete'/>
                </Label>
                </span>
            </List.Item>
        });


        return <div>
            <Form>
                <Form.Field>
                    <label>
                        <Icon name='question'/> Question
                    </label>
                </Form.Field>
                <Form.Field>
                    <TextArea placeholder='Tell us more' name="questions" value={this.state.questions}
                              onChange={(event) => this.handleChange(event)}/>
                </Form.Field>
                <Form.Field>
                    <label>
                        <Icon name='code'/> Answer
                    </label>
                </Form.Field>
                <Form.Field>
                    <TextArea placeholder='Tell us more' name="answer" value={this.state.answer}
                              onChange={(event) => this.handleChange(event)}/>
                </Form.Field>
                <Button type='button' onClick={(event) => this.handleSubmit(event)}>Submit</Button>
            </Form>
            <div>
                <Label>
                    <Icon name='question circle'/> Questions
                </Label>
            </div>
            <List>{aaa}</List>

        </div>
    }

}

