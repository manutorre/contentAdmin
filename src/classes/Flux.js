import Link from './Link'
import FluxContent from './FluxContent';

export default class Flux {

  constructor(name, contents, links){
    this.name = name;
    this.contents = contents ? contents.map(content => new FluxContent(content.identificador, content.contentId, content.categoria, content.order)) : [];
    this.links = links ? links : []
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
    this.setContents(this.contents.filter(content => content.identificador !== identificador))
  }


  getOrderedContentsFromOrderField(){
    return this.contents.sort((content1,content2) => {return content1.getOrder() - content2.getOrder()})
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

  addLinkWithOriginAndDestination(from, to){
    this.addLink(new Link(from, to))
  }

  removeLink(link){
    this.setLinks(fluxLink => fluxLink !== link)
  }

  getOrderedLinksFromContentsOrder(){
    let links = []
    this.getOrderedContentsFromOrderField().map( (content,i) => {
      if (this.getOrderedContentsFromOrderField()[i + 1]) {
        let origin = content.getName()
        let destination = this.getOrderedContentsFromOrderField()[i + 1].getName()
        links.push(new Link(origin, destination))
      }
    })
    this.links = links
    return links
  }


  //when the flux edition is done, the order of the contents is determined by the links, not by the contents array order.


  getOrderedContentsFromLinks(){
    let firstContent = this.getFirstContentFromLinks();
    let nextContent = firstContent;
    let orderedContents = [firstContent]
    this.links.map( link => {
      let auxLink = this.getLinkWithOrigin(nextContent);
      nextContent = this.getContentById(auxLink.destination);
      orderedContents.push(nextContent);
    })
    return orderedContents;    
  }

  getFirstContentFromLinks(){ //returns the content that is no destination for any link but that is origin of one. contents out of the flow are ignored
    return this.contents.filter( content => {
      return this.links.filter( link => link.destination.toLowerCase() === content.getName().toLowerCase()).length === 0 &&
             this.links.filter( link => link.origin.toLowerCase() === content.getName().toLowerCase()).length === 1
    })[0];
  }

  getLinkWithOrigin(content){
    return this.links.filter(link => link.origin.toLowerCase() === content.getName().toLowerCase())[0]
  }

  getContentById(contentId){
    return this.contents.filter(content => content.getName().toLowerCase() === contentId.toLowerCase())[0]
  }

}