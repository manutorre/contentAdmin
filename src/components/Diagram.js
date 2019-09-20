import React, {Component} from 'react';
import go from 'gojs';
import {Button, Spin, Modal, Input, Select, Collapse, Icon, message,Checkbox, Radio} from 'antd'
import axios from 'axios'
import FluxContent from '../classes/FluxContent';
import DroppableContent from '../classes/DroppableContent';
import Flux from '../classes/Flux';
const goObj = go.GraphObject.make;

export default class GoJs extends Component {

  constructor (props) {
    super (props);
    this.renderCanvas = this.renderCanvas.bind (this);
    this.state = {
      keyForRerender:0,
      flux:null,
      temporaryContent:null,
      temporaryLink:null,
      valueRadioLink:null,
      valueRadioNode:null,
      valueCheck:false,
      modalLinkVisible:false,
      modalNodeVisible:false,
      contents:[],
      myModel: null, 
      myDiagram: null,
      loading:false,
      success:null,
      error:null,
      modalVisible:false,
      inputValue:null,
      inputValueText:null,
      showSend:false,
      pattern:null,
      index:null,
      addedContents:[],
      patterns:["Leer solo titulos","Leer introduccion y contenido"],//,"Read paragraph to paragraph"
      infoPatterns:["Solo se leeran los titulos de los contenidos definidos para el flujo."
      ,"Se leeran los titulos de los contenidos definidos de a uno por vez, dando la posibilidad de elegir entre leer solo una introduccion o tambien el resto del contenido."
      ] //,"The body of the contents will be read paragraph by paragraph."
    }
    this.onDiagramEnter = this.onDiagramEnter.bind(this)
    this.onDiagramDrop = this.onDiagramDrop.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.sendData = this.sendData.bind(this)
    this.renderCanvas = this.renderCanvas.bind(this)
    this.showSendDataModal = this.showSendDataModal.bind(this)
    this.onChangeInput = this.onChangeInput.bind(this)
    this.generateNodeTemplate = this.generateNodeTemplate.bind(this)
    this.generateLinkTemplate= this.generateLinkTemplate.bind(this)
  }

  componentWillReceiveProps(props){
    if (props.shouldShowFlux !== this.props.shouldShowFlux || props.flux !== this.props.flux) {
      this.addContentsManually(props.flux);
      console.log(this.state)
    }
  }

  componentDidMount () {
    this.renderCanvas ();
  }

  handlePattern(pattern){
    var index;
    switch(pattern){
      case "Leer solo titulos":
        index = 0
      break;
      case "Leer introduccion y contenido":
        index = 1
      break;
      case "Leer parrafo a parrafo":
        index = 2
      break;
    }

    this.setState({pattern,index})
  }

  generateNodeTemplate(){
    var handlerThis = this;
    let nodeTemplate = goObj(
      go.Node,
     "Auto",
      {
        doubleClick: function(e, node) {
            // node is the Node that was double-clicked
            let data = node.data;
            let key = data.key
            handlerThis.setState({
              modalNodeVisible:true,
              temporaryContent:key
            })
        }
      },
      new go.Binding('location'),
      goObj(
        go.Shape, "RoundedRectangle",
        {
          portId: "", 
          fromLinkable: true, 
          toLinkable: true,
          toMaxLinks:1,
          fromMaxLinks:1,
          toLinkableSelfNode: false
        },
        new go.Binding("fill", "color")
      ),
      goObj(
        go.TextBlock,
        { margin: 6, font: "18px sans-serif" },
        new go.Binding("text", "identificador")
      )
    )
    return nodeTemplate;    
  }

  generateLinkTemplate(){
    var handlerThis = this;
    let linkTemplate = goObj(go.Link,
      { curve: go.Link.Bezier },
      {
        doubleClick: function(e, link) {
            // node is the Node that was double-clicked
            let key = link.toNode.data.key;
            handlerThis.setState({
              modalLinkVisible:true,
              temporaryLink:key
            })
        }
      },
      {relinkableFrom: true, relinkableTo: true},
      goObj(go.Shape),  // the link shape
      goObj(go.Shape,   // the arrowhead
        { toArrow: "OpenTriangle", fill: null })
    );
    return linkTemplate
  }


  renderCanvas () {
    let model = goObj(go.TreeModel)
    let diagram = goObj(go.Diagram, this.refs.goJsDiv, {initialContentAlignment: go.Spot.Center});
    diagram.addDiagramListener("LinkDrawn", (ev) => {
      this.state.flux.addLinkWithOriginAndDestination(ev.subject.fromNode.data.key, ev.subject.toNode.data.key);
      this.setState({keyForRerender:Math.random()})
    })
    diagram.addDiagramListener("LinkRelinked", (ev) => {
      this.state.flux.relink(ev.parameter.part.key, ev.subject) // first param is the discarded node of the link, the second is the one that remains
    })
    diagram.addDiagramListener("SelectionDeleted", (ev) => {
      if (ev.subject.first().Yd.from) {
        this.state.flux.removeLinkWithOriginAndDestination(ev.subject.first().Yd.from, ev.subject.first().Yd.to)      
        this.setState({keyForRerender:Math.random()})
      }
      else{
        this.state.flux.removeContent(ev.subject.first().part.data.key)
        this.state.flux.removeLinkWithOrigin(ev.subject.first().part.data.key)
        this.state.flux.removeLinkWithDestination(ev.subject.first().part.data.key)
        this.setState({keyForRerender:Math.random()})
      }
    })
    this.setModelAndDiagram(model, diagram)
  
  }

  showSendDataModal(){
    this.setState({modalVisible:true})
  }

  sendData(){
        let contents = this.state.flux.getOrderedContentsFromLinks()
        this.setState({loading:true})
        let contentsToSend = {nombreConjunto:this.state.inputValue, pattern:this.state.pattern, contents:contents}
        axios.post('https://alexa-apirest.herokuapp.com/users/createFlow/user/gonza', contentsToSend)
        .then(() => {this.setState({
          loading:false,success:"success", showSend:false})
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            this.setState({
              loading:false,
              error:error.response.data
            }, this.setState({
              error:null
            }))
          }
          else{
            console.log(error)
          }
        })
        this.setState({
          modalVisible:false,
        })
        /* if(this.state.showSend){
          axios.put('https://alexa-apirest.herokuapp.com/users/updateFlow/user/gonza', contentsToSend).then(() => {
            this.setState({loading:false,success:"success",showSend:false})
            this.state.myDiagram.div = null;
          })
          .catch((error) => {
            error.response && error.response.data ? 
            this.setState({loading:false,error:error.response.data})
            :
            console.log(error)
          })
        }else{ */
        /* } */
  }
  
  setModelAndDiagram(model, diagram){
    diagram.model = new go.GraphLinksModel([],[]);
    diagram.nodeTemplate = this.generateNodeTemplate()
    diagram.linkTemplate = this.generateLinkTemplate()
    diagram.validCycle = go.Diagram.CycleDestinationTree;
    this.setState({
      myModel: model, 
      myDiagram: diagram
    })    
  }
  
  onDiagramEnter(event){
    event.preventDefault();
  }

  getFluxContent(content){
    return new FluxContent(content.identificador, content.contentId, content.categoria, content.order)
  }

  getDroppableContent(properties){ //crea el content object
    let parsedContent1 = JSON.parse(properties[0].type)
    let parsedContent2 = JSON.parse(properties[1].type)
    let parsedContent3 = JSON.parse(properties[2].type)
    let parsedContent4 = JSON.parse(properties[3].type)
    const content = {...parsedContent1,...parsedContent2,...parsedContent3,...parsedContent4}
    return new DroppableContent(content.identificador, content.contentid, content.categoria, content.isnavegable ) 
  }

  isNotInDiagram(content){ //if the content is not in the diagram
    return !this.state.addedContents.some(addedContent => JSON.stringify(addedContent.getIdContent()) === JSON.stringify(content.getIdContent()))
  }


  doesLinkApplies(link, oldContents){ //if the new link is related with any of the previous contents, then it should not be added
    return !oldContents.some( content => link.origin.toLowerCase() === content.getName().toLowerCase() ||  link.destination.toLowerCase() === content.getName().toLowerCase() )
  }

  addContentToGoJsDiagram(content, fluxName, point){ //creates the content in the apps diagram
    this.state.myDiagram.startTransaction('new node');
    this.state.myDiagram.model.addNodeData({
      key:content.getName(),
      location:point,
      identificador:fluxName !== "" ? fluxName + " - " + content.getName() : content.getName(),
      color:go.Brush.randomColor()}
      )
      this.state.myDiagram.commitTransaction('new node');
  }

  addLinkToGoJsDiagram(link){ //creates the link in the apps diagram
    this.state.myDiagram.startTransaction('new link');
    this.state.myDiagram.model.addLinkDataCollection([{
      from:link.origin,
      to:link.destination
    }])
    this.state.myDiagram.commitTransaction('new link');
  }


  addContentsManually(flux){
    let newFlux = new Flux(flux.name);
    const oldContents = this.state.addedContents
    flux.getOrderedContentsFromOrderField().map( (content, i) => {
      if (this.isNotInDiagram(content)) {
        newFlux.addContent(content)
        let point = this.state.myDiagram.transformViewToDoc(new go.Point(300 + i * 100 , 100 + (i * 100)));
        this.addContentToGoJsDiagram(content,flux.name,point) //adds the content to the actual Diagram
        this.setState(prevState => ({
          addedContents:[...prevState.addedContents, content]
        }))
      }
    })
    flux.getOrderedLinksFromContentsOrder().map(link => {
      if (this.doesLinkApplies(link,oldContents)) {
        this.addLinkToGoJsDiagram(link)
        newFlux.addLink(link)
      }
    })
    if (this.state.flux) {
      this.state.flux.contents.map( content => newFlux.addContent(content))
      this.state.flux.links.map(link => newFlux.addLink(link))
    }
    this.setState({
      flux:newFlux,
      inputValue:flux.name
    })
  }

  calculateDroppedPoint(event){
    window.PIXELRATIO = this.state.myDiagram.computePixelRatio();
    let pixelratio = window.PIXELRATIO;
    let can = event.target;
    // if the target is not the canvas, we may have trouble, so just quit:
    if (!(can instanceof HTMLCanvasElement)) return;
    var bbox = can.getBoundingClientRect();
    var bbw = bbox.width;
    if (bbw === 0) bbw = 0.001;
    var bbh = bbox.height;
    if (bbh === 0) bbh = 0.001;
    var mx = event.clientX - bbox.left * ((can.width/pixelratio) / bbw);
    var my = event.clientY - bbox.top * ((can.height/pixelratio) / bbh);
    return this.state.myDiagram.transformViewToDoc(new go.Point(mx, my));
  }
  
  
  onDiagramDrop(event){
    let content = this.getDroppableContent(event.dataTransfer.items)
    if (this.isNotInDiagram(content)) { 
      if (this.state.flux === null) { //if a flux is not being edited in the application
        let newFlux = new Flux('new flux');
        newFlux.addContent(content)
        this.setState({flux: newFlux})
      }
      else{ //if there is already a flux being edited
        this.state.flux.addContent(content)
      }
      let point = this.calculateDroppedPoint(event); //calculates the drop event point
      let {contents} = this.state
      contents.push(content)
      this.setState({contents})    
      this.addContentToGoJsDiagram(content, "", point) //inserts the content in the diagram
      this.setState(prevState => ({
        addedContents:[...prevState.addedContents, content]
      }))
    }
  }

  onDragOver(event){
    //-----FALTA CONTROLAR QUE NO SE PUEDA SOLTAR UN CONTENIDO INHABILITADO EN EL DIAGRAMA
    //Agregar tmb un metodo para dar aviso al hacer un mouseOver sobre el contenido inhabilitado
    event.stopPropagation();
    event.preventDefault();
  }

  success = () => {
    message.success('Se ha creado un nuevo flujo!', 3 , function(){
      window.location.reload()
    });   
  };

  error = () => {
    message.error('Ocurrio un error al intentar crear un nuevo flujo', 3);
  };
  
  onChangeInput(e){
    this.setState({inputValue:e.target.value})
  }

  onChangeInputText = (e) =>{
    this.setState({inputValueText:e.target.value})
  }

  onChangeRadioLink = (e) =>{
    this.setState({
      valueRadioLink:e.target.value
    })
  }
  
  onChangeRadioNode = (e) =>{
    this.setState({
      valueRadioNode:e.target.value
    })
  }

  onChangeCheckNode = (checkedValue) => {
  }
  onChangeCheckLink = (checkedValue) => {
    this.setState({
      valueCheck:checkedValue.target.checked
    })
  }

  confirmNodeModal = () =>{
    let contentNode = this.state.temporaryContent //name del nodo
    this.state.flux.getContentByName(contentNode).setData({pattern:this.state.valueRadioNode})
    this.setState({
      modalNodeVisible:false,
      temporaryContent:null,
      valueRadioNode:null
    })
  }

  confirmLinkModal = () =>{
    let contentNode = this.state.temporaryLink //link.destination
    this.state.flux.getContentByName(contentNode).setData({
      metaInfo:this.state.inputValueText,
      next:this.state.valueRadioLink
    })
    this.setState({
      modalLinkVisible:false,
      inputValueText:null,
      temporaryLink:null
  	})
  }

  nodeModal(){
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const RadioGroup = Radio.Group;
    return(
      <Modal
        title="Nodo"
        centered = {true}
        visible={this.state.modalNodeVisible}
        onOk={this.confirmNodeModal}
        onCancel={() => this.setState({modalNodeVisible:false,valueRadioNode:null,temporaryContent:null})}>
        <div>
          <p>Opciones de Lectura:</p>
          <Checkbox onChange={this.onChangeCheckNode}>
              'Preguntar antes para poder navegar'
          </Checkbox>
          <br></br>
          <RadioGroup onChange={this.onChangeRadioNode} value={this.state.valueRadioNode}>
            <Radio style={radioStyle} value={"Title"}>Solo titulo</Radio>
            <Radio style={radioStyle} value={"All"}>Titulo, introduccion y contenido</Radio>
          </RadioGroup>
        </div>             
      </Modal>
    )
  }

  linkModal(){
    const RadioGroup = Radio.Group;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return(
      <Modal
      title="Link"
      visible={this.state.modalLinkVisible}
      onOk={this.confirmLinkModal}
      onCancel={() => this.setState({modalLinkVisible:false})}>
      <div>
        <p>Como continuar la lectura de contenidos?</p>
        <Checkbox onChange={this.onChangeCheckLink}>
            Leer texto previo al contenido
            {this.state.valueCheck === true ? <Input placeholder="Ingresar texto" onChange={this.onChangeInputText} style={{ width: 100, marginLeft: 10 }} /> : null}
        </Checkbox>
        <br></br>
        <RadioGroup onChange={this.onChangeRadioLink} value={this.state.valueRadioLink}>
          <Radio style={radioStyle} value={"Read directly"}>Leer directamente el proximo contenido</Radio>
          <Radio style={radioStyle} value={"Ask"}>Preguntar antes de leer el proximo contenido</Radio>
        </RadioGroup>
      </div>
    </Modal>
    )
  }
  
  submitModal(){
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
      marginTop:"20px"
    };
    const {Option} = Select
    const {Panel} = Collapse;
    return(
      <Modal
        title="Confirmar accion"
        visible={this.state.modalVisible}
        onOk={this.sendData}
        onCancel={() => this.setState({modalVisible:false})}>
          <div>
            Por favor, ingrese un nombre para el conjunto de contenidos a enviar
            <Input value={this.state.inputValue} style={{width:"100px", marginLeft:"170px",marginTop:"20px"}} onChange={this.onChangeInput}></Input> 
            <p> Seleccionar un patron de lectura de contenidos </p>
            <Select value={this.state.pattern? this.state.pattern : undefined} placeholder="Patron de lectura" onChange={(e) => this.handlePattern(e)} style={{width:"230px", marginLeft:"130px"}}>
              {this.state.patterns.map( (pattern, index) => 
                <Option 
                  key={index}   
                  value={pattern}>
                    {pattern}
                </Option>
              )}
            </Select>
            { this.state.pattern &&
              <Collapse bordered={false} defaultActiveKey={['1']} expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0}> </Icon>}>                
                <Panel header={this.state.pattern} key="1" style={customPanelStyle}>
                  <p style={{ paddingLeft: 24 }}> {this.state.infoPatterns[this.state.index]} </p>
                </Panel>
              </Collapse>
            }
          </div>
      </Modal>
    )
  }  

  render () {
    console.log(this.state.flux)
    const goJsStyle = {'width': '116%','height': '874px', 'backgroundColor': "white",'marginLeft':"-16%"}
    return(
      <div>
        {this.state.loading && <div className="example"><Spin className="diagram-spin" size="large"/></div>}
        <div onDragEnter={this.onDiagramEnter}  className="diagram" onDrop={this.onDiagramDrop} onDragOver={this.onDragOver}>
          <div  ref="goJsDiv" style={goJsStyle}></div>
        </div>
        <div className="sendButtonContainer">{ this.state.success ? this.success() : null }
          <Button 
          className="sendButton"         
          onClick={this.showSendDataModal} key={this.state.keyForRerender} 
          disabled={!this.state.flux || (this.state.flux && this.state.flux.contents.length !== (this.state.flux.links.length + 1))}> 
            Deployar el skill 
          </Button>
          {this.state.error && this.error()}
        </div>
        {this.nodeModal()}
        {this.linkModal()}
        {this.submitModal()}
      </div>
    ) 
  }
}