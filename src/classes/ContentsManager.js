import { Link } from "gojs";

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
    this.fluxes = fluxes
  }

  getFluxesNames(){
    return this.fluxes.map( flux => flux._id)
  }


  getContentsForFlux(fluxId){
    return this.fluxes.filter( flux => 
      flux._id === fluxId
    )[0].contenidos
  }

  getFluxes(){
    return this.fluxes
  }

  getContentsForFluxOrdered(fluxId){
    return this.getContentsForFlux(fluxId).sort((content1,content2) => {return content1.order - content2.order})
  }

  getLinks(){
    return this.contents;
  }
    
  setLinks(links){
    this.links = links
  }

  addLink(link){
    /*
      this adds a link
    */
    this.links.push(link);
  }


  getFirstContent(){
    return this.contents.filter( content => {
      return this.links.filter( link => link.destination === content.idcontent.toLowerCase()).length === 0 //Es necesaria hacer esta comparacion?
    })[0];
  }

  getFirstLink(){
    return this.links.filter( link => link.origin === (this.getFirstContent().idcontent).toLowerCase())[0]
  }


  getContentById(contentId){
    return this.contents.filter(content => content.idcontent.toLowerCase() === contentId)[0]
  }

  getLinkWithOrigin(content){
    return this.links.filter(link => link.origin === content.idcontent.toLowerCase())[0]
  }



  contentsOrderFromLinks(){
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