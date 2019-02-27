import React from 'react'
import MultiCard from "./MultiCard.js"
import { Tabs, Select } from 'antd';
import FluxTab from './FluxTab.js';
import axios from 'axios'


export default class LeftPanel extends React.Component {
  constructor(props){
      super(props)
      this.state = {
        selectedItem:""
      }
  }

  selectCategory(value){
    console.log(value)
    axios.get("https://alexa-apirest.herokuapp.com/users/admin/contentsByCategory/"+value+"/gonza")
    .then( (response) => {
      if (response.data.length > 0) {
        this.props.manager.setContents(response.data);
      }
      this.setState({
        selectedItem:value
      })  
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

  generateStyles(index){
    return(
      {
        position:"relative",
        width:"80%",
        //height:"95px",
        border:"1px solid",
        margin:"0 auto",
        //bottom:"40px",
        top:"5px"
      }   
    ) 
  }

  render(){
    const TabPane = Tabs.TabPane;
    const {Option} = Select
    const styles = this.generateStyles()

    return(
      <div className="no-assigned__cards__container">
        <Tabs>
          <TabPane tab="Contents" key="1">
            {this.props.categories.length > 0 &&
              <div>
              <h3 style={{color:"white",left:"10px"}}> Filter by category </h3>
              <Select value={this.state.selectedItem? this.state.selectedItem : undefined}  placeholder="Category" 
                  onChange={(e) =>this.selectCategory(e)} style={styles}>
                  
                  {this.props.categories.map( (category, index) => {
                    return(
                        <Option 
                          key={index} 
                          value={category.toString()}>
                            {category.toString()}
                        </Option>
                        )
                    })
                  }
              </Select>
              <br/>
              <br/>
              <br/>
              </div>
            }
            
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