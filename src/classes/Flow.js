import Link from './Link'
import FlowContent from './FlowContent';
import FlowState from './FlowState';

export default class Flow {

  constructor(name, contents, links){
    this.name = name;
    this.contents = contents ? contents.map(content => new FlowContent(content.identificador, content.contentId, content.categoria, content.order)) : [];
    this.links = links ? links : []
    this.state = new FlowState();
    return this;
  }
  
  addLink(link){
    this.links.push(link)
  }
  
  removeLink(link){
    this.setLinks(fluxLink => fluxLink !== link)
  }

  getLinks(){
    return this.links;
  }
    
  setLinks(links){
    this.links = links
  }
  
  getContents(){
    return this.contents
  }
  
  addContent(content){
    this.contents.push(content)
  }
  
  setContents(contents){
    this.contents = contents
  }
  
  removeContent(identificador){
    this.setContents(this.contents.filter(content => !content.hasName(identificador)));
  }

  getOrderedLinks(){
    let links = []
    this.getOrderedContents().map( (content,i) => {
      if (this.getOrderedContents()[i + 1]) {
        let origin = content.getName()
        let destination = this.getOrderedContents()[i + 1].getName()
        links.push(new Link(origin, destination))
      }
    })
    this.links = links
    return links
  }

  relink(discardedNodeKey, subject){
    let subjectFromLinkKey = subject.fromNode.data.key
    let subjectToLinkKey = subject.toNode.data.key
    if (this.links.filter(link => link.hasOriginAndDestination(subjectFromLinkKey, discardedNodeKey)).length > 0) {
      this.removeLinkWithOriginAndDestination(subjectFromLinkKey, discardedNodeKey)
    }
    else{
      if (this.links.filter(link => link.hasOriginAndDestination(discardedNodeKey, subjectFromLinkKey)).length > 0) {
        this.removeLinkWithOriginAndDestination(discardedNodeKey, subjectToLinkKey)
      }
    }
    this.addLink(new Link(subjectFromLinkKey, subjectToLinkKey))
  }  

  getOrderedContents(){
    return this.state.getOrderedContents(this.contents, this.links)
  }

  
  removeLinkWithOrigin(from){
    this.setLinks(this.links.filter(link => !link.hasOrigin(from)))
  }
  
  removeLinkWithDestination(to){
    this.setLinks(this.links.filter(link => !link.hasDestination(to)))
  }  

  removeLinkWithOriginAndDestination(from, to){
    this.setLinks(this.links.filter(link => !link.hasOriginAndDestination(from, to)))
  }

  addLinkWithOriginAndDestination(from, to){
    this.addLink(new Link(from, to))
  }

  changeState(state){
    this.state.changeState(state)
  }

  getContentByName(name){
    return this.contents.filter(content => content.hasName(name))[0]
  }


}