import React from 'react'
import {Layout} from 'antd'
import LeftPanel from './LeftPanel'
import Diagram from './Diagram'
import axios from 'axios'
import Flow from '../classes/Flow'

export default class ContentAdmin extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      showFluxContent: false,
      diagramFluxId: false,
      categories: [],
      contents:[],
      fluxes:[]
    }
    this.changeContents = this.changeContents.bind(this)
    this.addFluxToDiagram = this.addFluxToDiagram.bind(this)
  }

  componentDidMount(){
    axios.get("https://alexa-apirest.herokuapp.com/users/categories").then( (response) => {
      if (response.data.length > 0) this.setState({categories:response.data}) 
    });

    axios.get("https://alexa-apirest.herokuapp.com/users/admin/contentsByFirstCategory").then( (response) => {
      if (response.data.length > 0) this.setState({contents:response.data})  
    });
    axios.get("https://alexa-apirest.herokuapp.com/users/admin/contentsAndFlows").then( (response) => {
      let fluxes;
      if (response.data.length > 0) {
        fluxes = response.data.map(flux => {
          return new Flow(flux._id, flux.contenidos)
        })
      }
      this.setState({fluxes})  
  })    
  }

  changeContents(newContents){
    this.setState({contents:newContents})
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
              changeContents={this.changeContents}
              contents={this.state.contents}
              fluxes={this.state.fluxes}
              addFluxToDiagram={this.addFluxToDiagram}
              categories={this.state.categories}
              />
          }
        </Sider>
        <Layout>
          <Header style={{color:"white",fontSize:"20px"}}>SkillMaker</Header>
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
