export default class Content {

  constructor(name, idContent, category, data){
    this.name = name;
    this.idContent = idContent
    this.category = category
    this.metadata = {}
  }

  getName(){
    return this.name
  }

  getIdContent(){
    return this.idContent
  }

  getCategory(){
    return this.category
  }

  setName(name){
    this.name = name;
  }

  setIdContent(idContent){
    this.idContent = idContent;
  }

  setCategory(category){
    this.category = category;
  }

  getData(){
    return this.data
  }  

  setData(data){
    var keys = Object.keys(data)
    keys.map( k => this.metadata[k] = data[k] )
  }

  hasName(name) {
    return this.getName().toLowerCase() === name.toLowerCase();
  }

}