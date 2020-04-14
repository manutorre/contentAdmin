import Content from './Content'
export default class FlowContent extends Content {
    constructor(name, idContent, category, order){
        super(name, idContent, category)
        this.order = order
    }

    getOrder(){
        return this.order
    }

    setOrder(order){
        this.order = order
    }

} 