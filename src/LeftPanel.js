import React from 'react'
import MultiCard from "./MultiCard.js"

export default class LeftPanel extends React.Component {


  constructor(props){
    super(props)
    this.state = {
      idConjuntos:null
    }
  }

  onContentDragEnd(event,content){
     event.target.style.display = "none"
     event.target.style.border = "";
  }

  onContentDragStart(event,content){
    event.dataTransfer.setData(JSON.stringify({idContent:content.identificador}), 'idContent');
    event.dataTransfer.setData(JSON.stringify({category:content.categoria}), 'category');
    event.dataTransfer.setData(JSON.stringify({url:"cielosports.com"}), 'url');
    event.dataTransfer.setData(JSON.stringify({xpath:"asdsad"}), 'xpath');    
    let dragged = event.target;
    event.target.style.border = "2px solid red";
  }

  render(){
    return(
      <div className="no-assigned__cards__container">
        {this.props.data.map((datos) =>
          datos.contenidos.map( (content, index) => 
            <div onDragStart={(e) => this.onContentDragStart(e,content)} key={index}>
              <MultiCard  
                identificador={content.identificador} 
                categoria={content.categoria}
                cantidad={content.siblingsId ? content.siblingsId.length : null}
              />
            </div>
          )
        )}
      </div>
    )
  }

}