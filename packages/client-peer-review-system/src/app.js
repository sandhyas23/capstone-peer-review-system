import React from 'react';
import {Button, Form, Grid,Header,Segment,Message} from 'semantic-ui-react'
import students from './students.json';
import StudentView from './studentView';
import TeacherView from './TeacherView';



export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { netId: "" , password:"" , students:students, role:"", message:""};
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
            return (student.netid === this.state.netId && student.password === this.state.password)
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
            return<Grid centered columns={2}>
                <Grid.Column>
                    <Header as="h2" textAlign="center">
                        Login
                    </Header>
                    <Segment>
                        <Form size="large">
                            <Form.Input
                                fluid
                                icon="user"
                                iconPosition="left"
                                placeholder="Net ID"
                                name="netId"
                                value={this.state.netId}
                                onChange={(event) => this.handleChange(event)}
                            />
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
                            <Button onClick={() => this.login()} color="blue" fluid size="large">
                                Login
                            </Button>
                        </Form>
                    </Segment>
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
            return <TeacherView />
        }

        else if(this.state.role === "student"){
            return <StudentView />
        }

        else if(this.state.role === "none"){
            return <div>not authorized</div>
        }
    }
}

