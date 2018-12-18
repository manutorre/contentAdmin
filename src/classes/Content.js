export default class Content {

  constructor(xpath, url, idContent, category, metaInfo){
    this.xpath = xpath;
    this.url = url
    this.idContent = idContent
    this.metaInfo = metaInfo
    this.category = category
  }

  getXpath(){
    return this.xpath
  }

  getUrl(){
    return this.url
  }

  getidContent(){
    return this.idContent
  }

  getmetaInfo(){
    return this.metaInfo
  }

  getCategory(){
    return this.category
  }

  setXpath(xpath){
    this.xpath = xpath;
  }

  setUrl(url){
    this.url = url;
  }

  setidContent(idContent){
    this.idContent = idContent;
  }

  setmetaInfo(metaInfo){
    this.metaInfo = metaInfo;
  }

  setCategory(category){
    this.category = category;
  }


}