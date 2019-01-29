import React from 'react';
import { Card } from 'antd';


let fluxCard = { 
  cursor:"pointer", 
  width:"100%",
  border:"1px solid", 
  margin:"0 auto" 
}

export default class MultiCard extends React.Component{

  generateMultiCard(index){
    const { Meta } = Card;
    const title = index === this.props.cantidad ? this.props.identificador : ""
    const description = index === 2 ? (this.props.cantidad + " contenidos") : ""
    const styles = this.generateStyles(index)
    return(
      <Card key={index} style={styles}>
        <Meta title={title} description={description} />
      </Card>
    )
  }
  
  generateCard(){
    const { Meta } = Card;
    const title = this.props.identificador;;
    const description = this.props.categoria;
    return(
      <Card style={{ width:"100%",border:"1px solid", margin:"0 auto" }}>
        <Meta title={title} description={description}/>
      </Card>
    )
  }
  
  generateFluxCard(){
    const { Meta } = Card;
    const title = this.props.identificador;
    const description = "Flujo";
    return(
        <Card 
          style={fluxCard}>
          <Meta title={title} description={description}/>
        </Card>
    )
  }

  generateStyles(index){
    return(
      {
        position:"absolute",
        width:"100%",
        height:"95px",
        border:"1px solid",
        margin:"0 auto",
        top:(10 * index) + "px",
        left:(10 * index) + "px"
      }   
    ) 
  }
  

  render(){
    return(
      <div onClick={this.props.onClick} draggable={!this.props.flux} className="multicard-container">
        {this.props.flux ? 
          this.generateFluxCard()
        :
        this.props.cantidad > 1 ?
          [0,1,2].map((number,index) => 
            this.generateMultiCard(index)
          )
        :
          this.generateCard()
        }
      </div>
    )
  }

}