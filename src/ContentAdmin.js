import React from 'react'
import {Card, List, Icon, Layout} from 'antd'
import LeftPanel from './LeftPanel'
// import RightPanel from './RightPanel'
import Diagram from './Diagram'
import go from 'gojs';
import axios from 'axios'
import ContentsManager from './classes/ContentsManager'

export default class ContentAdmin extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      contents: [],
      showFluxContent: false,
      diagramFluxId: false
    }
    this.contentsManager = new ContentsManager();
    this.addFluxToDiagram = this.addFluxToDiagram.bind(this)
  }

  componentDidMount(){
    axios.get("https://alexa-apirest.herokuapp.com/users/admin/contentsByCategory/Lead Story/gonza").then( (response) => {
      if (response.data.length > 0) {
        this.contentsManager.setContents(response.data);
        this.setState({contents:response.data}) 
      }  
    });
    axios.get("https://alexa-apirest.herokuapp.com/users/admin/contentsAndFlows/gonza").then( (response) => {
      if (response.data.length > 0) {
        this.contentsManager.setFluxes(response.data);
        this.setState({fluxes:response.data}) 
      }  
  })    
  }

  addFluxToDiagram(id){
    console.log(id)
    this.setState({
      showFluxContent:true,
      diagramFluxId: id
    })
  }

  render(){

    const {Header, Sider, Content} = Layout;
    
    return(
      <div>
        <Layout style={{height:"1000px"}}>
        <Sider>
          {this.state.contents.length > 0 && 
            <LeftPanel 
              manager={this.contentsManager} 
              addFluxToDiagram={this.addFluxToDiagram}
              />
          }
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content>
            <Diagram
              shouldShowFlux={this.state.showFluxContent}
              contentsManager={this.contentsManager}
              data={[]}
              fluxId={this.state.diagramFluxId}
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
