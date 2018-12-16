import React from 'react'
import {Card, List, Icon, Layout} from 'antd'
import LeftPanel from './LeftPanel'
// import RightPanel from './RightPanel'
import Diagram from './Diagram'
import go from 'gojs';
import axios from 'axios'

export default class ContentAdmin extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      confirmedContents: [],
      editedContents: []
    }
  }

  componentWillMount(){
    axios.get("https://alexa-apirest.herokuapp.com/users/noticesByState/new/gonza").then( (response) => {
      response.data.length > 0 ? this.setState({confirmedContents:response.data}) : this.setState({confirmedContents:"No hay contenidos nuevos"})      
      console.log(response)})
      axios.get("https://alexa-apirest.herokuapp.com/users/noticesByState/edited/gonza").then( (response) => {
        console.log(response)
        response.data.length > 0 ? this.setState({editedContents:response.data}) : this.setState({editedContents:"No hay contenidos editados"})
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
          {this.state.editedContents.length > 0 &&
            <LeftPanel data={this.state.editedContents} edited/>
          }
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content>
            <Diagram 
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
