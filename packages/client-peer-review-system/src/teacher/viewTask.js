import React from 'react';
import { Form, Grid} from "semantic-ui-react";



export default class ViewTask extends React.Component{
    constructor(props){
        super(props);
        this.state={createdTask:props.createdTask, type:props.type , studentAssignment:props.studentAssignment}
    }

    render() {
        if (this.state.type === "submission"){
            console.log(this.state.createdTask);
            return   <div style={{marginLeft: 170, minWidth: 550, marginTop:50}}>
            <Grid padded stackable>
                <Form>
                    <Form.Field inline>
                        <Form.Input fluid label='Task Name' content={this.state.createdTask["task-name"]} readOnly />
                    </Form.Field>
                </Form>
            </Grid>
            </div>
        }

    }
}