import React from 'react'
import {Layout} from 'antd'
import LeftPanel from './LeftPanel'
// import RightPanel from './RightPanel'
import Diagram from './Diagram'
import axios from 'axios'
import ContentsManager from '../classes/ContentsManager'
import Flux from '../classes/Flux'

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
    this.contentsManager = new ContentsManager();
    this.changeContents = this.changeContents.bind(this)
    this.addFluxToDiagram = this.addFluxToDiagram.bind(this)
  }

  componentDidMount(){
    axios.get("https://alexa-apirest.herokuapp.com/users/categories/gonza").then( (response) => {
      if (response.data.length > 0) this.setState({categories:response.data}) 
    });

    axios.get("https://alexa-apirest.herokuapp.com/users/admin/contentsByFirstCategory/gonza").then( (response) => {
      if (response.data.length > 0) this.setState({contents:response.data})  
    });
    axios.get("https://alexa-apirest.herokuapp.com/users/admin/contentsAndFlows/gonza").then( (response) => {
      let fluxes;
      if (response.data.length > 0) {
        fluxes = response.data.map(flux => {
          return new Flux(flux._id, flux.contenidos)
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
