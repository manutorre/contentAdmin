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

  getFirstContent(){
    return this.contents.filter( content => {
      return this.links.filter( link => link.destination === content.identificador.toLowerCase()).length === 0 
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

  removeLinkWithOrigin(identificador){
    this.setLinks(this.links.filter(link => link.origin.toLowerCase() !== identificador))
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