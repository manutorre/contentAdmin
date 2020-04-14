export default class Metadata {

    constructor(metaInfo, nextText, pattern){
      this.metaInfo = metaInfo;
      this.nextText = nextText;
      this.pattern = pattern;
    }

    getPattern(){
        return this.pattern;
    }

    getMetaInfo(){
        return this.metaInfo;
    }
    
    getNextText(){
        return this.nextText;
    }    

    setPattern(pattern){
        this.pattern = pattern
    }

    setNextText(nextText){
        this.nextText = nextText
    }
    
    setMetaInfo(metaInfo){
        this.metaInfo = metaInfo
    }

}