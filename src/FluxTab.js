import React from 'react'
import MultiCard from "./MultiCard.js"
import {Modal,Button} from 'antd'

export default class FluxTab extends React.Component{


  constructor(props){
    super(props)
    this.state = { 
      modalVisible:[],
      fluxInDiagram:[]
    }
  }

  addFluxToDiagram(id){
    this.props.addFluxToDiagram(id);
    this.setState({
      modalVisible:false,
      fluxInDiagram:{
        [id]:true
      }
    })
  }


  renderModal(flux){
    return(
      <Modal
        key={flux}
        title={"Contents of flux - " + flux}
        visible={true}
        onCancel={() => this.setState({modalVisible:false})}
      >
        {this.props.manager.getContentsForFluxOrdered(flux).map( (content,i) => 
          <div key={i}>{content.identificador}</div>
        )}
        <Button 
          type="primary" 
          onClick={() => this.addFluxToDiagram(flux)}
          disabled={this.state.fluxInDiagram[flux]}
        >
          Edit
        </Button>
      </Modal>
    )
  }

  showContents(index){
    this.setState({
      modalVisible:{
        [index]:true
      }
    })
  }

  render(){
    return(
      <div>
        {this.props.manager.getFluxes().map( (flux,i) =>
          <div key={i}> 
            {this.state.modalVisible[i] && this.renderModal(flux._id)}
            <MultiCard
              disabled={this.state.fluxInDiagram[flux._id]}
              onClick={() => this.showContents(i)}
              flux={true}
              key={i}
              identificador={flux._id}
            />
          </div>
        )}
      </div>
    )
  }


}