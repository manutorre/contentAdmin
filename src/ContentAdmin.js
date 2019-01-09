import React from 'react'
import {Card, List, Icon, Layout} from 'antd'
import LeftPanel from './LeftPanel'
// import RightPanel from './RightPanel'
import Diagram from './Diagram'
import go from 'gojs';
import axios from 'axios'
import ContentsManager from './classes/ContentsManager.js'

export default class ContentAdmin extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      confirmedContents: [],
      editedContents: []
    }
    this.contentsManager = new ContentsManager();
    console.log(this.contentsManager)
  }

  componentWillMount(){
    axios.get("https://alexa-apirest.herokuapp.com/users/admin/contentsByCategory/Portada/gonza").then( (response) => {
      if (response.data.length > 0) {
        this.contentsManager.setContents(response.data);
        this.setState({confirmedContents:response.data}) 
      }  
  })
  }

  render(){

    const {Header, Sider, Content} = Layout;
    
    return(
      <div>
        <Layout style={{height:"1000px"}}>
        <Sider>
          {this.state.confirmedContents.length > 0 && 
            <LeftPanel data={this.state.confirmedContents}/>
          }
          {/* {this.state.editedContents.length > 0 &&
            <LeftPanel data={this.state.editedContents} edited/>
          } */}
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content>
            <Diagram 
              contentsManager={this.contentsManager}
              data={!typeof this.state.confirmedContents == "string" ? this.state.confirmedContents.map(
                (content) => { return{key:content.url, color:go.Brush.randomColor()}}
              ) : []}
              updateContents={ orderedContents => this.processContents(orderedContents)}
              />
            </Content>
        </Layout>
        <Sider>
          {/* <RightPanel sendData={() => this.sendData()}/> */}
        </Sider>
        </Layout>
      </div>
    )
  }

}
