# Capstone CS693: Peer review system

## Getting Started

This is a repository for the `peer-review-system` project. You can find the abstract for this project [here](https://docs.google.com/document/d/1vETkQTMDxEkAGyIHBleaevj6GZah05w6anZb6lgDW0o/edit?usp=sharing). 

This project follows a multimodule project stucture often referred to as monorepo github project; All the related modules to this projects are part of the same repository.
We are using [`Lerna`](https://lerna.js.org/) for automating the management of the modules/packages. Lerna is a tool that optimizes the workflow around managing multi-package repositories with git and npm. The project structure is as follows:
```
capstone-peer-review-system/
  package.json
  packages/
    client-peer-review-system/
      package.json
    server-peer-review-system/
      package.json
```

## Modules/Packages
### client-peer-review-system
Frontend app using `react.js` framework. 
### server-peer-review-system
`Express` app that acts as a restful webservice for the client.


## How to build locally?

#### Prerequisites
Requires [Node.js](https://nodejs.org/) to run.
Install node and npm using the following link
`https://www.npmjs.com/get-npm`

#### Clone the following repository
`git clone https://github.com/sandhyas23/capstone-peer-review-system.git`

#### Running the code locally

We will be using `Lerna` which is a `javascript` tool to manage multiple packages (Client and Server)
`npx lerna run start`

This will start up the `client` app in `http://localhost:8080` and the express server app in `http://localhost:3000`. 

### Tech stack

`peer-review-system` uses a number of open source projects to work properly:

#### client-peer-review-system
* [ReactJs](https://reactjs.org/) - Frontent framework for building user interfaces!
* [Semantic UI](https://semantic-ui.com/) - framework that helps create beautiful, responsive layouts using human-friendly HTML
* [node.js](https://nodejs.org/en/) - Javascript runtime.

#### server-peer-review-system
* [Express](https://expressjs.com/) - fast node.js network app framework.
* [node.js](https://nodejs.org/en/) - Javascript runtime.


