import Link from './Link'
import FluxContent from './FluxContent';
import FluxState from './FluxState';

export default class Flux {

  constructor(name, contents, links){
    this.name = name;
    this.contents = contents ? contents.map(content => new FluxContent(content.identificador, content.contentId, content.categoria, content.order)) : [];
    this.links = links ? links : []
    this.state = new FluxState();
    return this;
  }

  addLink(link){
    this.links.push(link)
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
    this.setContents(this.contents.filter(content => content.getName().toLowerCase() !== identificador.toLowerCase()))
  }

  relink(discardedNodeKey, subject){
    let subjectFromLinkKey = subject.fromNode.data.key
    let subjectToLinkKey = subject.toNode.data.key
    if (this.links.filter(link => link.destination === discardedNodeKey && link.origin === subjectFromLinkKey).length > 0) {
      this.removeLinkWithOriginAndDestination(subjectFromLinkKey, discardedNodeKey)
    }
    else{
      if (this.links.filter(link => link.origin === discardedNodeKey && link.destination === subjectToLinkKey).length > 0){
        this.removeLinkWithOriginAndDestination(discardedNodeKey, subjectToLinkKey)
      }
    }
    this.addLink(new Link(subjectFromLinkKey, subjectToLinkKey))
  }  

  removeLinkWithOriginAndDestination(from, to){
    this.setLinks(this.links.filter(link => !(link.origin === from && link.destination === to)))
  }

  removeLinkWithOrigin(from){
    this.setLinks(this.links.filter(link => link.origin !== from))
  }

  removeLinkWithDestination(to){
    this.setLinks(this.links.filter(link => link.destination !== to))
  }  

  addLinkWithOriginAndDestination(from, to){
    this.addLink(new Link(from, to))
  }

  removeLink(link){
    this.setLinks(fluxLink => fluxLink !== link)
  }

  getOrderedContents(){
    this.state.getOrderedContents(this.contents, this.links)
  }

  getOrderedLinksFromContentsOrder(){
    this.state.getContents(this.contents, this.links);
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

  changeState(state){
    this.state.changeState(state)
  }

}