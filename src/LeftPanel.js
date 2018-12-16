import React from 'react'
import { Card, Icon, Avatar } from 'antd';
import DoubleCard from "./DoubleCard.js"

export default class LeftPanel extends React.Component {


  constructor(props){
    super(props)
    this.state = {
      idConjuntos:null
    }
  }

  componentWillMount(){
    if (typeof this.props.data !== "string" && this.props.data.length > 0 && this.props.edited) {
      this.getAllidConjuntos();
    }    
  }

  onContentDragEnd(event,content){
     // reset the border of the dragged element
     event.target.style.display = "none"
     event.target.style.border = "";
  }

  onContentDragStart(event,content){
    console.log(content)
    event.dataTransfer.setData(JSON.stringify({idContent:content.idContent}), 'idContent');
    event.dataTransfer.setData(JSON.stringify({category:content.category}), 'category');
    event.dataTransfer.setData(JSON.stringify({state:content.state}), 'state');
    event.dataTransfer.setData(JSON.stringify({url:content.url}), 'url');
    event.dataTransfer.setData(JSON.stringify({xpath:content.xpath}), 'xpath');    
    // store a reference to the dragged element
    let dragged = event.target;
    // Objects during drag will have a red border
    event.target.style.border = "2px solid red";
  }

  getAllidConjuntos(){
    const idConjuntos = {}
    console.log(this.props)
    this.props.data.map(content => {
      console.log(content.idConjunto)
     if (!(content.idConjunto in idConjuntos)) {
        idConjuntos[content.idConjunto] = 1
     }
     else{
       idConjuntos[content.idConjunto] = idConjuntos[content.idConjunto] + 1 
     }
   })
   this.setState({
     idConjuntos:idConjuntos
   }, console.log(this.state.idConjuntos)) 
  }


  returnConjuntosCards(){
    if (this.props.edited) {
      const doubles = []
      for (var k in this.state.idConjuntos){
        // if (this.state.idConjuntos[k] > 1) {
            const contentsForDouble = this.props.data.filter(content => content.idConjunto === k)
            doubles.push(<DoubleCard key={k} idConjunto={k} cantidad={this.state.idConjuntos[k]} contenidos={contentsForDouble}/>)
        // }
      }
      return doubles;
    }
  }

  render(){
    const { Meta } = Card;
    console.log(this.props.data)
    return(
      <div className="no-assigned__cards__container">
        {this.returnConjuntosCards()}
        {typeof this.props.data !== "string" ? this.props.data.map( (content, index) => {
          if (!this.props.edited) {
            return(
              <div 
              key={index}
              draggable={this.props.edited ? "false" : "true"} 
              onDragStart={(e) => this.onContentDragStart(e,content)}
              onDragEnd={(e) => this.onContentDragEnd(e,content)}>
                <Card
                style={{ width:"80%",border:"1px solid" }}
                  >
                    <Meta
                      title={content.idContent}
                      description={content.category}
                    />
                </Card>
              </div>
            )
          }
        })
        : <div style={{color:"white"}}>
          {this.props.data}
        </div>
        }
        {/* <DoubleCard/> */}
      </div>
    )
  }

}