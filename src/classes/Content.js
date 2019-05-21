export default class Content {

  constructor(name, idContent, category){
    this.name = name;
    this.idContent = idContent
    this.category = category
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

  getIsNavegable(){
    return this.isNavegable
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

}