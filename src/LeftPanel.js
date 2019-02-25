import React from 'react'
import MultiCard from "./MultiCard.js"
import { Tabs } from 'antd';
import FluxTab from './FluxTab.js';
export default class LeftPanel extends React.Component {

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
          <TabPane tab="Contents" key="1">
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