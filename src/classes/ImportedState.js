export default class ImportedState {
    getOrderedContents(contents, links) {
        return contents.sort((content1,content2) => {return content1.getOrder() - content2.getOrder()})     
    }
}