import React from 'react'
import MultiCard from "./MultiCard.js"
import { Tabs, Button } from 'antd';

export default class LeftPanel extends React.Component {


  constructor(props){
    super(props)
    this.state = {
      idConjuntos:null
    }
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
    return(
      <div className="no-assigned__cards__container">
        <Tabs>
          <TabPane tab="Contenidos" key="1">
            {this.props.data.map((datos) =>
              datos.contenidos.map( (content, index) => 
                <div onDragStart={(e) => this.onContentDragStart(e,content)} key={index} onDragEnd={(e) => this.onContentDragEnd(e,content)}>
                  <MultiCard  
                    identificador={content.identificador} 
                    categoria={content.categoria}
                    cantidad={content.siblingsId ? content.siblingsId.length : null}
                  />
                </div>
              )
            )}
          </TabPane>
          <TabPane tab="Flujos" key="2">
            Content of tab 2
          </TabPane>          
        </Tabs>
      </div>
    )
  }

}