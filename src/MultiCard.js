import React from 'react';
import { Card } from 'antd';


export default class MultiCard extends React.Component{

  generateMultiCard(index){
    const { Meta } = Card;
    const title = index === this.props.cantidad ? this.props.identificador : ""
    const description = index === 2 ? (this.props.cantidad + " contenidos") : ""
    const styles = this.generateStyles(index)
    return(
      <Card draggable key={index} style={styles}>
        <Meta title={title} description={description} />
      </Card>
    )
  }
  
  generateCard(){
    const { Meta } = Card;
    const title = this.props.identificador;;
    const description = this.props.categoria;
    return(
      <Card draggable style={{ width:"80%",border:"1px solid" }}>
        <Meta title={title} description={description}/>
      </Card>
    )
  }

  generateStyles(index){
    return(
      {
        position:"absolute",
        width:"80%",
        height:"95px",
        border:"1px solid",
        top:(10 * index) + "px",
        left:(10 * index) + "px"
      }   
    ) 
  }

  render(){
    return(
      <div style={{position:"relative", marginBottom:"25px", height:"115px"}}>
        {this.props.cantidad > 1 ?
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