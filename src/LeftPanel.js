import React from 'react'
import MultiCard from "./MultiCard.js"
import { Tabs, Select, Layout, Menu, Breadcrumb, Icon } from 'antd';
import FluxTab from './FluxTab.js';
import axios from 'axios'

const {
  Header, Content, Footer, Sider,
} = Layout;
const SubMenu = Menu.SubMenu;

export default class LeftPanel extends React.Component {
  constructor(props){
      super(props)
      this.state = {
        selectedItem:"",
        collapsed:false
      }
  }

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  handleClick = (value) => {
    console.log("category",value)
    axios.get("https://alexa-apirest.herokuapp.com/users/admin/contentsByCategory/"+value.key+"/gonza").then( (response) => {
      if (response.data.length > 0) {
        this.props.manager.setContents(response.data);
      }  
    });
  }

  onContentDragEnd(event,content){
    if(event.dataTransfer.dropEffect !== 'none'){
      event.target.style.display = "none"
    } 
  }


  onContentDragStart(event,content){
    event.dataTransfer.setData(JSON.stringify({idContent:content.identificador}), 'idContent');
    event.dataTransfer.setData(JSON.stringify({category:content.categoria}), 'category');
    event.dataTransfer.setData(JSON.stringify({url:"cielosports.com"}), 'url');
    event.dataTransfer.setData(JSON.stringify({xpath:"asdsad"}), 'xpath');    
    // let dragged = event.target;
  }

  render(){
    const TabPane = Tabs.TabPane;
    const {Option} = Select
    return(
      <div className="no-assigned__cards__container">
        <Tabs>
          <TabPane tab="Contents" key="1">
          <Layout style={{ minHeight: '100vh' }}>
              <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
              >
              {this.props.categories.length > 0 &&
                <div>
                <Menu theme="dark" defaultSelectedKeys={['0']} mode="inline" onClick={this.handleClick} >  
                  <SubMenu
                    key="sub1"
                    title={<span><Icon type="tags" /><span>Categories</span></span>}
                  >
                    {this.props.categories.map( (category, index) => {
                      return(
                        <Menu.Item key={category}> {category} </Menu.Item>
                        )
                      })
                    } 
                  </SubMenu>
                </Menu>
                </div>
              }
              <br/>

              {this.props.manager.getContents().map((datos) =>
              datos.contenidos.map( (content, index) => 
                <div 
                key={index} 
                onDragStart={(e) => this.onContentDragStart(e,content)} 
                onDragEnd={(e) => this.onContentDragEnd(e,content)}
                >
                  <MultiCard  
                    identificador={content.identificador} 
                    categoria={content.categoria}
                    cantidad={content.siblingsId ? content.siblingsId.length : null}
                  />
                </div>
              )
            )}
              </Sider>        
            </Layout>
          </TabPane>
          <TabPane tab="Fluxs" key="2">
              <FluxTab 
                manager={this.props.manager}
                addFluxToDiagram={this.props.addFluxToDiagram}  
              />
          </TabPane>          
        </Tabs>
      </div>
    )
  }

}