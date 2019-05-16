import { Link } from "gojs";
import Flux from './Flux.js'

export default class ContentsManager {

  constructor(){
    this.contents = []; //array of Content class elements
    this.links = []; //array of Link class elements
    this.fluxes = []
  }

  getContents(){
    return this.contents;
  }

  setContents(contents){
    this.contents = contents
  }

  setFluxes(fluxes){
    let fluxesArray = [];
    fluxes.forEach(flux => { fluxesArray.push(new Flux(flux._id, flux.contenidos))  });
    this.fluxes = fluxesArray
  }

  getFluxesNames(){
    return this.fluxes.map( flux => flux.name)
  }

  getContentsForFlux(fluxId){
    return this.fluxes.filter( flux => 
      flux.name === fluxId
    )[0].contents
  }

  getFluxes(){
    return this.fluxes
  }

  getContentsForFluxOrdered(fluxId){
    return this.getContentsForFlux(fluxId).sort((content1,content2) => 
      content1.order - content2.order
    )
  }

  getLinks(){
    return this.contents;
  }
    
  setLinks(links){
    this.links = links
  }

  addLink(link){
    this.links.push(link);
  }

  getFirstContent(){ //returns the content that is no destination for any link but that is origin of one. contents out of the flow are ignored
    return this.contents.filter( content => {
      return this.links.filter( link => link.destination.toLowerCase() === content.identificador.toLowerCase()).length === 0 &&
             this.links.filter( link => link.origin.toLowerCase() === content.identificador.toLowerCase()).length === 1
    })[0];
  }

  getFirstLink(){
    return this.links.filter( link => link.origin.toLowerCase() === (this.getFirstContent().identificador).toLowerCase())[0]
  }

  getContentById(contentId){
    return this.contents.filter(content => content.identificador.toLowerCase() === contentId.toLowerCase())[0]
  }

  getLinkWithOrigin(content){
    return this.links.filter(link => link.origin.toLowerCase() === content.identificador.toLowerCase())[0]
  }

  removeRelinkedLink(discardedNodeKey, subject){
    let subjectFromLinkKey = subject.fromNode.key
    let subjectToLinkKey = subject.toNode.key
    if (this.links.filter(link => link.destination === discardedNodeKey && link.origin === subjectFromLinkKey).length > 0) {
      return this.removeLinkWithOriginAndDestination(subjectFromLinkKey, discardedNodeKey)
    }
    else{
      if (this.links.filter(link => link.origin === discardedNodeKey && link.destination === subjectToLinkKey).length > 0){
        return this.removeLinkWithOriginAndDestination(discardedNodeKey, subjectToLinkKey)
      } 
    }
  }

  removeLinkWithOriginAndDestination(from, to){
    this.setLinks(this.links.filter(link => !(link.origin === from && link.destination === to)))
  }

  getOrderedContents(){
    let firstContent = this.getFirstContent();
    let nextContent = firstContent;
    let orderedContents = [firstContent]
    this.links.map( link => {
      let auxLink = this.getLinkWithOrigin(nextContent);
      nextContent = this.getContentById(auxLink.destination);
      orderedContents.push(nextContent);
    })
    return orderedContents;
  }

}