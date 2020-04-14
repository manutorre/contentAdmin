import RenderedState from './RenderedState'
import ImportedState from './ImportedState'

export default class FlowState {
    constructor(state){
        switch (state) {
            case 'rendered':
                this.currentState = new RenderedState;
                break;
            default:
                this.currentState = new ImportedState;
                break;
        }
    }

    changeState(state){
        this.currentState = state === 'rendered' ? new RenderedState : new ImportedState;
    }

    getOrderedContents(contents, links){
        return this.currentState.getOrderedContents(contents, links);
    }

}