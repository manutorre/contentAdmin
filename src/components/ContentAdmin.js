import React from 'react'
import {Layout} from 'antd'
import LeftPanel from './LeftPanel'
// import RightPanel from './RightPanel'
import Diagram from './Diagram'
import axios from 'axios'
import ContentsManager from '../classes/ContentsManager'

export default class ContentAdmin extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      showFluxContent: false,
      diagramFluxId: false,
      categories: [],
      contents:[]
    }
    this.contentsManager = new ContentsManager();
    this.addFluxToDiagram = this.addFluxToDiagram.bind(this)
  }

  componentDidMount(){
    axios.get("https://alexa-apirest.herokuapp.com/users/categories/gonza").then( (response) => {
      if (response.data.length > 0) {
        this.setState({categories:response.data}) 
      }  
    });

    axios.get("https://alexa-apirest.herokuapp.com/users/admin/contentsByFirstCategory/gonza").then( (response) => {
      if (response.data.length > 0) {
        this.contentsManager.setContents(response.data);
        this.setState({contents:response.data})
      }  
    });
    axios.get("https://alexa-apirest.herokuapp.com/users/admin/contentsAndFlows/gonza").then( (response) => {
      if (response.data.length > 0) {
        this.contentsManager.setFluxes(response.data);
      }  
  })    
  }

  addFluxToDiagram(flux){
    this.setState({
      showFluxContent:true,
      diagramFlux: flux
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
              contents={this.state.contents}
              manager={this.contentsManager} 
              addFluxToDiagram={this.addFluxToDiagram}
              categories={this.state.categories}
              />
          }
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content>
            <Diagram
              shouldShowFlux={this.state.showFluxContent}
              flux={this.state.diagramFlux}
            />
          </Content>
        </Layout>
        <Sider>
        </Sider>
      </Layout>
      </div>
    )
  }

}
