import React from 'react';
import {Button, Form,Grid,Header,Segment,Message} from 'semantic-ui-react'
import students from './data/students.json';
import StudentView from './student/studentView';
import TeacherView from './teacher/teacherView';
import submissionTasks from './data/createdSubmissionTasks';
import reviewTasks from './data/createdReviewTasks'
import Prism from "prismjs";




export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { netId: "" , password:"" , students:students, role:"", message:"", submissionTasks:submissionTasks,
        reviewTasks:reviewTasks};
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });

    }

    login() {
        //console.log(this.state.netId, this.state.password);
        const userId = this.state.netId;
        const userPwd = this.state.password;

        const user = this.state.students.find((student, index, array) => {
            return (student["netId"] === userId && student.password === userPwd)
        });
        //console.log(user.role);
        if(typeof user ==="undefined"){
            this.setState({netId: "" , password: "" ,message:"Invalid credentials"})
        }
        else{
            if(user.role === "instructor"){
                this.setState({role:"instructor"});
            }
            else if(user.role === "student"){
                this.setState({role:"student"});
            }
            else{
                this.setState({ role:"none"});
            }
        }
    }


    render() {
        if(this.state.role === "") {
            return <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='blue' textAlign='center'>
                         Log-in to your account
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input
                                fluid icon='user'
                                iconPosition='left'
                                placeholder='Net ID'
                                name="netId"
                                value={this.state.netId}
                                onChange={(event) => this.handleChange(event)}/>
                            <Form.Input
                                fluid
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={(event) => this.handleChange(event)}
                            />

                            <Button type ="button" color='blue' onClick={() => this.login()} fluid size='large'>
                                Login
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        <Header as='h4' color='red'>
                            {this.state.message}
                        </Header>
                        Having trouble ? Contact the Instructor
                    </Message>
                </Grid.Column>
            </Grid>
        }

        else if(this.state.role === "instructor"){
            return <TeacherView netId={this.state.netId} role={this.state.role}
                                submissionTasks={this.state.submissionTasks} reviewTasks={this.state.reviewTasks}/>
        }

        else if(this.state.role === "student"){
            return <StudentView netId={this.state.netId} role={this.state.role}
                                submissionTasks={this.state.submissionTasks} reviewTasks={this.state.reviewTasks}/>
        }

        else if(this.state.role === "none"){
            return <div>not authorized</div>
        }
    }
}

