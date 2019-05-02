import Link from './Link'

export default class Flux {

  constructor(name, contents, links){
    this.name = name;
    this.contents = contents;
    this.links = links
  }

  getContents(){
    return this.contents
  }

  getOrderedContents(){
    return this.contents.sort((content1,content2) => {return content1.order - content2.order})
  }

  getOrderedLinks(){
    let links = []
    this.getOrderedContents().map( (content,i) => {
      if (this.getOrderedContents()[i + 1]) {
        let origin = content.identificador
        let destination = this.getOrderedContents()[i + 1].identificador
        links.push(new Link(origin, destination))
      }
    })
    this.links = links
    return links
  }


}