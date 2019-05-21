import Content from './Content'
export default class DroppableContent extends Content {
    constructor(name, idContent, category, isNavegable){
        debugger
        super(name, idContent, category)
        this.isNavegable = isNavegable
    }

    getisNavegable(){
        return this.isNavegable
    }

    setIsNavegable(isNavegable){
        this.isNavegable = isNavegable
    }

} 