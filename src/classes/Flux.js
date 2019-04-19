export default class Flux {

  constructor(name, contents, links){
    this.name = name;
    this.contents = contents;
    this.links = links
  }

  getContents(){
    return this.contents
  }


}