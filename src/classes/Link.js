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

  hasOrigin(origin){
    return this.origin.toLowerCase() === origin.toLowerCase();
  }

  hasDestination(destination){
    return this.destination.toLowerCase() === destination.toLowerCase();
  }

  hasOriginAndDestination(origin, destination) {
    return this.hasOrigin(origin) && this.hasDestination(destination)
  }

}