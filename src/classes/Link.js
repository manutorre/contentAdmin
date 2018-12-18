export default class Link {

  constructor(origin, destination){
    this.origin = origin;
    this.destination = destination;
  }

  getOriginContent(){
    return this.origin;
  }

  getDestinationContent(){
    return this.destination;
  }

  setOriginContent(content){
    this.origin = content;
  }

  setDestinationContent(content){
    this.destination = content;
  }

}