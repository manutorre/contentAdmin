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
      patterns:["Read only titles","Read introduction and content"],//,"Read paragraph to paragraph"
      infoPatterns:["Only the titles of the contents defined in the flow will be read continuously."
      ,"The titles of the defined contents will be read one at a time, giving the possibility to choose to read an introduction and then the rest of the content."
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
      case "Read only titles":
        index = 0
      break;
      case "Read introduction and content":
        index = 1
      break;
      case "Read paragraph to paragraph":
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
            let identificador = data.identificador
            handlerThis.setState({
              modalNodeVisible:true,
              temporaryContent:identificador
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
            let identificador = link.toNode.data.identificador;
            handlerThis.setState({
              modalLinkVisible:true,
              temporaryLink:identificador
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
        this.state.flux.removeContent(ev.subject.first().part.data.identificador)
      }
    })
    this.setModelAndDiagram(model, diagram)
  
  }

  showSendDataModal(){
    this.setState({modalVisible:true})
  }

  sendData(){
        let contents = this.state.flux.getOrderedContentsFromLinks()
        this.setState({
            loading:true
        })
        let contentsToSend = {nombreConjunto:this.state.inputValue, pattern:this.state.pattern, contents:contents}
        if(this.state.showSend){
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
        }else{
          axios.post('https://alexa-apirest.herokuapp.com/users/createFlow/user/gonza', contentsToSend).then(() => {
            this.setState({loading:false,success:"success"})
            this.state.myDiagram.div = null;
          })
          .catch((error) => {
            error.response && error.response.data ? 
            this.setState({loading:false,error:error.response.data})
            :
            console.log(error)
          })
        }
    this.setState({
      modalVisible:false,
    })
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

  isNotInDiagram(content){
    let flag = false;
    let isAlreadyInDiagram = this.state.addedContents.filter( addedContent => {
      return JSON.stringify(addedContent.getIdContent()) === JSON.stringify(content.getIdContent())
    }).length > 0
    if (!isAlreadyInDiagram) {
      flag = true
    }
    return flag;
  }


  doesLinkApplies(link, oldContents){
    return oldContents.filter( content => link.origin.toLowerCase() === content.getName().toLowerCase() || link.destination.toLowerCase() === content.getName().toLowerCase() )
      .length === 0
  }

  addContentsManually(flux){
    let newFlux = new Flux(flux.name);
    let diagram = this.state.myDiagram
    const oldContents = this.state.addedContents
    flux.getOrderedContentsFromOrderField().map( (content, i) => {
      if (this.isNotInDiagram(content)) {
        newFlux.addContent(content)
        diagram.startTransaction('new node');
        let point = diagram.transformViewToDoc(new go.Point(300 + i * 100 , 100 + (i * 100)));
        diagram.model.addNodeData({
          key:content.getName(),
          location:point,
          identificador:flux.name + " - " + content.getName(),
          color:go.Brush.randomColor()}
          )
          diagram.commitTransaction('new node');
          this.setState(prevState => ({
            addedContents:[...prevState.addedContents, content]
          }))
      }
    })
    flux.getOrderedLinksFromContentsOrder().map(link => {
      if (this.doesLinkApplies(link,oldContents)) {
        console.log(link)
        newFlux.addLink(link)
        diagram.startTransaction('new link');
        diagram.model.addLinkDataCollection([{
          from:link.origin,
          to:link.destination
        }])
        diagram.commitTransaction('new link');
      }
    })
    if (this.state.flux) {
      this.state.flux.contents.map( content => newFlux.addContent(content))
      this.state.flux.links.map(link => newFlux.addLink(link))
    }
    this.setState({
      flux:newFlux,
      myDiagram:diagram,
      myModel:diagram.model,
      inputValue:flux.name
    })
  }


  onDiagramDrop(event){
    let content = this.getDroppableContent(event.dataTransfer.items)
    console.log(this.isNotInDiagram(content))
    if (this.isNotInDiagram(content)) {
      if (this.state.flux === null) {
        this.setState({flux: new Flux('new flux', [content])})
      }
      else{
        this.state.flux.addContent(content)
      }
      window.PIXELRATIO = this.state.myDiagram.computePixelRatio();
      let pixelratio = window.PIXELRATIO;
      let can = event.target;
  
      // if the target is not the canvas, we may have trouble, so just quit:
      if (!(can instanceof HTMLCanvasElement)) return;
      let diagram = this.state.myDiagram
      var bbox = can.getBoundingClientRect();
      var bbw = bbox.width;
      if (bbw === 0) bbw = 0.001;
      var bbh = bbox.height;
      if (bbh === 0) bbh = 0.001;
      var mx = event.clientX - bbox.left * ((can.width/pixelratio) / bbw);
      var my = event.clientY - bbox.top * ((can.height/pixelratio) / bbh);
      var point = diagram.transformViewToDoc(new go.Point(mx, my));
      diagram.startTransaction('new node')
      let {contents} = this.state
      contents.push(content)
      this.setState({contents})    
      diagram.model.addNodeData({
        location: point,
        identificador: content.getName(),
        color:go.Brush.randomColor(),
        key:content.getName() //key is the same as identificador
      });
      diagram.commitTransaction('new node');
      this.setState({
        myDiagram:diagram,
        myModel:diagram.model
      })
      this.setState(prevState => ({
        addedContents:[...prevState.addedContents, content]
      }))
    }
  }

  onDragOver(event){
    event.stopPropagation();
    event.preventDefault();
  }

  success = () => {
    message.success('A new flow was created!', 3 , function(){
      window.location.reload()
    });   
  };

  error = () => {
    message.error('An error occurred when trying to create a new flow', 3);
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
    //Asociar nodo con info del modal: meter en un array toda la info de los nodos, cada uno con un identificador del nodo
    let contentNode = this.state.temporaryContent //idContent del nodo
    let contents = this.state.contents
    let indice = null 
    this.state.contents.map((cont,index)=>{
      if(cont.identificador === contentNode)
        indice = index
    })
    if(contents[indice].data) 
    	contents[indice].data.read = this.state.valueRadioNode
    else
    	contents[indice].data = {"read":this.state.valueRadioNode}

    this.setState({
      modalNodeVisible:false,
      contents:contents,
      temporaryContent:null,
      valueRadioNode:null
    })
  }

  confirmLinkModal = () =>{
    //Asociar link con info del modal: meter en un array toda la info de los links, cada uno con un id del link
    let contentNode = this.state.temporaryLink //link.destination
    let contents = this.state.contents
    let indice = null 
    this.state.contents.map((cont,index)=>{
      if(cont.identificador === contentNode)
        indice = index
    })
    if(contents[indice].data){ 
    	contents[indice].data.metainfo = this.state.inputValueText
    	contents[indice].data.next = this.state.valueRadioLink
    }
    else{
    	contents[indice].data = {
    		"metainfo":this.state.inputValueText, 
    		"next":this.state.valueRadioLink
    	}
    }

    this.setState({
      modalLinkVisible:false,
      inputValueText:null,
      contents:contents,
      temporaryLink:null
  	})
  }

  render () {
    const {Option} = Select
    const Panel = Collapse.Panel;
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
      marginTop:"20px"
    };
    
    const RadioGroup = Radio.Group;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    console.log(this.state.flux)
    return(
      
      <div>
        {this.state.loading && 
          <div className="example">
            <Spin className="diagram-spin" size="large"/>
          </div>
        }
        <div 
        onDragEnter={this.onDiagramEnter} 
        className="diagram"
        onDrop={this.onDiagramDrop}
        onDragOver={this.onDragOver}
        >
          <div  ref="goJsDiv" style={{
              'width': '116%',
              'height': '874px', 
              'backgroundColor': "white",
              'marginLeft':"-16%"
            }}>
          </div>
        </div>

        <div className="sendButtonContainer">
          {(this.state.success)? this.success() : null }

          <Button className="sendButton" 
          onClick={this.showSendDataModal} 
          key={this.state.keyForRerender}
          disabled={!this.state.flux || (this.state.flux && this.state.flux.contents.length !== (this.state.flux.links.length + 1))}> 
            Deploy to skill 
          </Button>
          
          {(this.state.error)? this.error() : null}
      </div>
      <div>
          <Modal
            title="Node"
            centered = {true}
            visible={this.state.modalNodeVisible}
            onOk={this.confirmNodeModal}
            onCancel={() => this.setState({modalNodeVisible:false,valueRadioNode:null,temporaryContent:null})}>
            <div>
              <p>Reading:</p>
              <Checkbox onChange={this.onChangeCheckNode}>
                   'Ask for browse'
              </Checkbox>
              <br></br>
              <RadioGroup onChange={this.onChangeRadioNode} value={this.state.valueRadioNode}>
                <Radio style={radioStyle} value={"Title"}>Only title</Radio>
                <Radio style={radioStyle} value={"All"}>Title,introduction and content</Radio>
              </RadioGroup>
            </div>             
          </Modal>
      </div>
      <div>
          <Modal
            title="Link"
            visible={this.state.modalLinkVisible}
            onOk={this.confirmLinkModal}
            onCancel={() => this.setState({modalLinkVisible:false})}>
            <div>
              <p>How to continue?</p>
              <Checkbox onChange={this.onChangeCheckLink}>
                  Read text previosly
                  {this.state.valueCheck === true ? <Input placeholder="Insert text" onChange={this.onChangeInputText} style={{ width: 100, marginLeft: 10 }} /> : null}
              </Checkbox>
              <br></br>
              <RadioGroup onChange={this.onChangeRadioLink} value={this.state.valueRadioLink}>
                <Radio style={radioStyle} value={"Read directly"}>Read the next content directly</Radio>
                <Radio style={radioStyle} value={"Ask"}>Ask for reading next</Radio>
              </RadioGroup>
            </div>
          </Modal>
      </div>

        <Modal
          title="Confirm your action"
          visible={this.state.modalVisible}
          onOk={this.sendData}
          onCancel={() => this.setState({modalVisible:false})}>
            <div>
              Please, enter a name for the set of contents to send
              <Input value={this.state.inputValue} style={{width:"100px", marginLeft:"170px",marginTop:"20px"}} onChange={this.onChangeInput}>
              </Input> 
              <p> Select a content reading pattern </p>
              <Select value={this.state.pattern? this.state.pattern : undefined} placeholder="Content reading pattern" 
            onChange={(e) => this.handlePattern(e)} style={{width:"230px", marginLeft:"130px"}}>
              {this.state.patterns.map( (pattern, index) => {
                return(
                  <Option 
                    key={index}   
                    value={pattern}>
                      {pattern}
                  </Option>
                )
              })}
              </Select>
              { this.state.pattern &&
              <Collapse bordered={false} defaultActiveKey={['1']}
              expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0}> </Icon>} 
              >                
                  <Panel header={this.state.pattern} key="1" style={customPanelStyle}>
                    <p style={{ paddingLeft: 24 }}> {this.state.infoPatterns[this.state.index]} </p>
                  </Panel>
              </Collapse>
              }
            </div>
        </Modal>
      </div>
    ) 
  }
}

GoJs.defaultProps = { data: '[]' };