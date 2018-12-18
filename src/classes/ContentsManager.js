export default class ContentsManager {

  constructor(contents, links){
    this.contents = contents; //array of Content class elements
    this.links = links; //array of Link class elements
  }

  getContents(){
    return this.contents;
  }

  setContents(contents){
    this.contents = contents
  }

  getLinks(){
    return this.contents;
  }
    
  setLinks(links){
    this.links = links
  }

  getFirstContent(){
    return this.contents.filter( content => {
      return this.links.filter( link => link.destination === content.idContent).length === 0
    })[0];
  }

  getFirstLink(){
    return this.links.filter( link => link.origin === this.getFirstContent().idcontent)[0]
  }

  getLinkWithOrigin(content){
    return this.links.filter(link => link.origin === content)[0]
  }

  getContentById(contentId){
    return this.contents.filter(content => content.idContent === contentId)[0]
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