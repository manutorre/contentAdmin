import React from 'react'
import {Card, List, Icon, Layout, Checkbox, Radio, Popover, Input, Button} from 'antd'
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
      diagramFluxId: false,
      categories: [],
      value:null,
      valueCheck:false
    }
    this.contentsManager = new ContentsManager();
    this.addFluxToDiagram = this.addFluxToDiagram.bind(this)
    this.onChangeCheck = this.onChangeCheck.bind(this)
    this.onChangeRadio = this.onChangeRadio.bind(this)
    this.onChange = this.onChange.bind(this)
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
  onChangeRadio(e){
    console.log('radio checked', e.target.value);
    this.setState({
      value:e.target.value
    })
  }
  
  onChangeCheck(checkedValues){
    console.log('checked = ', checkedValues);
  }
  onChange(checkedValue){
    this.setState({
      valueCheck:checkedValue.target.checked
    })
    console.log('checked = ', checkedValue);
  }
  render(){

    const {Header, Sider, Content} = Layout;
        const CheckboxGroup = Checkbox.Group;
    const plainOptions = ['Only titles', 'Title,introduction and content', 'Ask for browse'];

    const content = (
      <div>
        <p>Reading:</p>
        <CheckboxGroup options={plainOptions} defaultValue={['Only titles']} onChange={this.onChangeCheck} >
        </CheckboxGroup>
      </div>
    );

    const RadioGroup = Radio.Group;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const content2 = (
      <div>
        <p>How to continue?</p>
        <Checkbox onChange={this.onChange}>
            Read text previosly
            {this.state.valueCheck === true ? <Input placeholder="Insert text" style={{ width: 100, marginLeft: 10 }} /> : null}
        </Checkbox>
        <br></br>
        <RadioGroup onChange={this.onChangeRadio} value={this.state.value}>
          <Radio style={radioStyle} value={1}>Read the next content directly</Radio>
          <Radio style={radioStyle} value={2}>Ask for reading next</Radio>
      </RadioGroup>
      </div>
    )
    
    return(
      <div>
        <Layout style={{height:"1000px"}}>
        <Sider>
          {this.state.contents.length > 0 && 
            <LeftPanel 
              manager={this.contentsManager} 
              addFluxToDiagram={this.addFluxToDiagram}
              categories={this.state.categories}
              />
          }
        </Sider>
        <Layout>
          <Header>Header</Header>

          <div>

              <Popover trigger="click"
                content={content} title="Node">
                <Button style={{"background": "transparent",
        "border": "none"}}></Button>
              </Popover>
              <Popover  trigger="click"
                content={content2} title="Link">
                <Button style={{"background": "transparent",
        "border": "none"}}></Button>
              </Popover>
            </div>
          
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
