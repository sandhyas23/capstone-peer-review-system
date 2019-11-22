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
      const _this =this;
        const loginDetails ={netId:this.state.netId,password:this.state.password}
        fetch('/login',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:JSON.stringify(loginDetails)
        }).then(response => response.json())
            .then(function(data) {
                console.log (data);

                if(!data.netId || data.netId !== _this.state.netId ){
                    _this.setState({netId: "" , password: "" ,message:data.message})
                }
                else {
                    if(data.role === "instructor"){
                        _this.setState({role:data.role,firstName:data.firstName,lastName:data.lastName});
                    }
                    else if(data.role === "student"){
                        _this.setState({role:data.role,firstName:data.firstName,lastName:data.lastName});
                    }
                    else{
                        _this.setState({ role:"none"});
                    }
                }

            });
    }

    logout(){
        console.log("clicked logout in app");
        const _this = this;
        fetch('/logout', {
            method:"GET" ,
            headers:{
                'Content-Type': "application/json",
                'Accept': 'application/json'
            }
        }).then(function(response) {
            console.log("logged out");
            _this.setState({netId:"", password:"", role:"", message:""});
        })
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
                                submissionTasks={this.state.submissionTasks} reviewTasks={this.state.reviewTasks}
                                onlogoutClick={()=>this.logout()}/>
        }

        else if(this.state.role === "student"){
            return <StudentView netId={this.state.netId} role={this.state.role}
                                submissionTasks={this.state.submissionTasks} reviewTasks={this.state.reviewTasks}
                                onlogoutClick={()=>this.logout()} firstName={this.state.firstName} lastName={this.state.lastName}
            />
        }

        else if(this.state.role === "none"){
            return <div>not authorized</div>
        }
    }
}

