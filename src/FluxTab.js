import React from 'react'
import MultiCard from "./MultiCard.js"
import {Modal,Button} from 'antd'

export default class FluxTab extends React.Component{


  constructor(props){
    super(props)
    this.state = { modalVisible:[] }
  }

  renderModal(flux){
    return(
      <Modal
        key={flux}
        title={"Contenidos del flujo " + flux}
        visible={true}
        onCancel={() => this.setState({modalVisible:false})}
      >
        {this.props.manager.getContentsForFluxOrdered(flux).map( (flux,i) => 
          <div key={i}>{flux.identificador}</div>
        )}
        <Button type="primary" onClick={() => console.log("boton")}>Editar</Button>
      </Modal>
    )
  }

  showContents(flux,index){
    this.setState({
      modalVisible:{
        [index]:true
      }
    })
  }

  render(){
    return(
      <div>
        {this.props.manager.getFluxesNames().map( (flux,i) =>
          <div key={i}> 
            {this.state.modalVisible[i] && this.renderModal(flux)}
            <MultiCard
              onClick={() => this.showContents(flux,i)}
              flux={true}
              key={i}
              identificador={flux} 
            />
          </div>
        )}
      </div>
    )
  }


}