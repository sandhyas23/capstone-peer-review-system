/*Main app  that renders the student or teacher view based on login*/

import React from 'react';
import {Button, Form,Grid,Header,Segment,Message} from 'semantic-ui-react'
//import students from './data/students.json';
import StudentView from './student/studentView';
import TeacherView from './teacher/teacherView';
import Cookies from 'universal-cookie';
//import Cookies from 'js-cookie';
//import submissionTasks from './data/createdSubmissionTasks';
//import reviewTasks from './data/createdReviewTasks'
//import Prism from "prismjs";




export default class App extends React.Component {
    constructor(props) {
        super(props);
        const cookies = new Cookies();
        const gotCookie =cookies.get('user');
         console.log("cookies",cookies.get('user'));
        // const gotCookie = JSON.parse(Cookies.get('user'));
        if(typeof cookies.get('user') !== "undefined"){
            //console.log("kkkk","cookies",JSON.parse(Cookies.get('user')).role);
            this.state = { netId: gotCookie.netId , role:gotCookie.role,firstName:gotCookie.firstName,
                lastName:gotCookie.lastName};
        }
        else {
            this.state = {netId: "", password: "", role: "", message: ""};
        }
    }

    // function to handle change in input
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });

    }
    // function to handle login button
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
                // change role in state based on the user details
                if(!data.netId || data.netId !== _this.state.netId ){
                    _this.setState({netId: "" , password: "" ,message:data.message, firstName:"",lastName:""})
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
    // function to handle logout button
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

    // Render the elements
    render() {
        console.log("state,", this.state);
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
        // Display different components based on the role of user
        else if(this.state.role === "instructor"){
            return <TeacherView netId={this.state.netId} role={this.state.role}
                                onlogoutClick={()=>this.logout()}/>
        }

        else if(this.state.role === "student"){
            return <StudentView netId={this.state.netId} role={this.state.role}
                                onlogoutClick={()=>this.logout()} firstName={this.state.firstName} lastName={this.state.lastName}
            />
        }

        else if(this.state.role === "none"){
            return <div>not authorized</div>
        }
    }
}

