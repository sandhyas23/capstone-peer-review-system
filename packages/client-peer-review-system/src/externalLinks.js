// Component to display buttons that links to Linkedin and project source profile

import React from 'react';
import {Button, Grid, Icon, Rail, Sticky} from "semantic-ui-react";

export default class ExternalLinks extends React.Component{
    render() {
        {/*Added github and linkedin profile*/}
       return <div style={{ padding: "1em" }} >
            <Rail
                icon={'linkedin'}
                internal
                position="right"
                attached
                style={{ top: "auto", height: "auto", width: "30em" }}
            >
                <Sticky >
                    <Button.Group>

                        <Button attached='right' color="linkedin"
                                onClick ={()=>
                                    window.open(`https://www.linkedin.com/in/sandhya-sankaran/`,'_blank')}>
                            <Icon name={"linkedin"}/> About the developer
                        </Button>
                        <Button attached='left' color="teal"
                                style={{marginLeft:"1em"}}
                                onClick={()=>
                                    window.open("https://github.com/sandhyas23/capstone-peer-review-system",'_blank')}>
                            <Icon name={"github"}/> Source
                        </Button>
                    </Button.Group>

                </Sticky>
            </Rail>

        </div>

    }

}