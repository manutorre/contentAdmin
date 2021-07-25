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

  addFluxToDiagram(flux){
    this.props.addFluxToDiagram(flux);
    this.setState({
      modalVisible:false,
      fluxInDiagram:{
        [flux.name]:true
      }
    })
  }


  renderModal(flux){
    return(
      <Modal
        key={flux.name}
        title={"Skill contents - " + flux.name}
        visible={true}
        onCancel={() => this.setState({modalVisible:false})}
      >
        {flux.getOrderedContents().map( (content,i) => 
          <div key={i}>{content.getName()}</div>
        )}
        <Button 
          type="primary" 
          onClick={() => this.addFluxToDiagram(flux)}
          disabled={this.state.fluxInDiagram[flux.name]}
        >
          Editar
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
          {this.props.fluxes != null && this.props.fluxes.map( (flux,i) =>
            <div key={i}> 
              {this.state.modalVisible[i] && this.renderModal(flux)}
              <MultiCard
                disabled={this.state.fluxInDiagram[flux.name]}
                onClick={() => this.showContents(i)}
                flux={true}
                key={i}
                identificador={flux.name}
              />
            </div>
          )}
      </div>
    )
  }
}