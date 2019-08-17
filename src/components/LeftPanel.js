import React from 'react'
import MultiCard from "./MultiCard.js"
import { Tabs, Select } from 'antd';
import FluxTab from './FluxTab.js';
import axios from 'axios'


export default class LeftPanel extends React.Component {
  constructor(props){
      super(props)
      this.state = {
        selectedItem:"",
        hiddenCards:[]
      }
  }

  selectCategory(value){
    console.log(value)
    axios.get("https://alexa-apirest.herokuapp.com/users/admin/contentsByCategory/"+value+"/gonza")
    .then( (response) => {
      if (response.data.length > 0) {
            let contents = response.data
            //let contentsFilter = contents.filter((elem)=> !this.state.hiddenCards.includes(elem.contenidos[0].identificador) )
            //let index = contentsFilter.indexOf(this.props.manager.getContentById(idContent))
            //contents = contentsFilter.splice(index,1)
            this.props.changeContents(contents);
      }
      this.setState({
        selectedItem:value
      })  
    });
  }

  onContentDragEnd(event,content){ 
    if(event.dataTransfer.dropEffect !== 'none'){
      //event.target.parentNode.style.display = "none"
      var hiddenCards = this.state.hiddenCards
      hiddenCards.push(content.identificador)
      this.setState({
        hiddenCards: hiddenCards
      })
      
      if(this.state.selectedItem !== ""){ 
        this.selectCategory(this.state.selectedItem) //Si todavia no asigno categoria, mandar la que es por defecto
      }
      else{ //Mandar la primera
        if(this.props.categories.length > 0)
          this.selectCategory(this.props.categories[0]) 
        else
          this.selectCategory(axios.get("https://alexa-apirest.herokuapp.com/users/getFirstCategory/gonza")) 
      } 
    } 
  }


  onContentDragStart(event,content){
    event.dataTransfer.setData(JSON.stringify({contentId:content.contentId}), 'contentId');
    event.dataTransfer.setData(JSON.stringify({identificador:content.identificador}), 'identificador');
    event.dataTransfer.setData(JSON.stringify({categoria:content.categoria}), 'categoria');
    event.dataTransfer.setData(JSON.stringify({isNavegable:content.available}), 'isNavegable');      
  }

  onContentClick(event,content){
    //modificar el campo available del content en la base

    //abrir en una nueva pestaña la url del contenido
    window.open(content.url, "_blank")
  }

  generateStyles(index){
    return(
      {
        position:"relative",
        width:"80%",
        //height:"95px",
        border:"1px solid",
        margin:"0 auto",
        //bottom:"40px",
        top:"5px"
      }   
    ) 
  }

  render(){
    const TabPane = Tabs.TabPane;
    const {Option} = Select
    const styles = this.generateStyles()
    return(
      <div className="no-assigned__cards__container">
        <Tabs>
          <TabPane tab="Contenidos" key="1">
            {this.props.categories.length > 0 &&
              <div>
              <h3 style={{color:"white",left:"10px"}}> Filtrar por categoria </h3>
              <Select value={this.state.selectedItem? this.state.selectedItem : undefined}  placeholder="Categoria" 
                  onChange={(e) =>this.selectCategory(e)} style={styles}>
                  {this.props.categories.map( (category, index) => {
                    return(
                        <Option 
                          key={index} 
                          value={category.toString()}>
                            {category.toString()}
                        </Option>
                        )
                    })
                  }
              </Select>
              <br/>
              <br/>
              <br/>
              </div>
            }
            
            {this.props.contents.map((content,index) =>
                <div
                key={index} 
                onDragStart={(e) => this.onContentDragStart(e,content.contenidos)} 
                onDragEnd={(e) => this.onContentDragEnd(e,content.contenidos)}
                onClick = {(e) => this.onContentClick(e,content.contenidos)}
                >
                  {!this.state.hiddenCards.find(hiddenCard => hiddenCard === content.contenidos.identificador) &&
                    <MultiCard  
                      identificador={content.contenidos.identificador} 
                      categoria={content.contenidos.categoria}
                      cantidad={content.contenidos.siblingsId ? content.contenidos.siblingsId.length : null}
                      available={content.contenidos.available} 
                    />
                  }
                </div>
              
          )}
          </TabPane>
          <TabPane tab="Flujos" key="2">
              <FluxTab 
                fluxes={this.props.fluxes}
                addFluxToDiagram={this.props.addFluxToDiagram}  
              />
          </TabPane>          
        </Tabs>
      </div>
    )
  }

}