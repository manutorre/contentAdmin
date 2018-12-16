import React from 'react';
import { Card, Modal } from 'antd';


export default class DoubleCard extends React.Component{
  
  constructor(props){
    super(props)
    this.state = {
      showModal:false
    }
    this.onConjuntosClick = this.onConjuntosClick.bind(this);
    // this.onCancelClick = this.onCancelClick.bind(this);
  }

  onConjuntosClick(){
    this.setState({
      showModal:!this.state.showModal
    })
  }

  // onCancelClick(e){
  //   console.log(e)
  //   this.setState({
  //     showModal:false
  //   }, console.log(this.state))
  // }


  showContentsForConjunto(){
    const {Meta} = Card;
    const contents = [];
    this.props.contenidos.map((content,i) => {
      contents.push(
        <Card  key={i} style={{ width:"130px",border:"1px solid",margin:"20px" }}>
            <Meta
              title={content.idContent}
              description={content.category}
            />
        </Card>        
      )
    })
    return contents;
  }

  render(){


    const { Meta } = Card;
    return(
      <div onClick={this.onConjuntosClick} style={{position:"relative", marginBottom:"45px"}}>
                <Modal
                  title="Prueba"
                  visible={this.state.showModal}
                  onCancel={this.onConjuntosClick}
                >
                  <div>
                    {this.showContentsForConjunto()}
                  </div>
                </Modal>
              <Card
              style={{ width:"80%",border:"1px solid",height:"95px" }}
                >
                  <Meta
                    title={""}
                    description={""}
                  />
              </Card>
              <Card
              style={{ width:"80%",border:"1px solid",position:"absolute",top:"10px",left:"10px" }}
                >
                  <Meta
                    title="Categoría"
                    description={"Descripción"}
                  />
              </Card>
              <Card
                style={{ width:"80%",border:"1px solid",position:"absolute",top:"20px",left:"20px", height:"95px" }}
                >
                  <Meta
                    title={this.props.idConjunto}
                    description={this.props.cantidad + " contenidos"}
                  />
              </Card>
      </div>
    )
  }


}