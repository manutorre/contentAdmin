export default class RenderedState {

    getOrderedContents(contents, links) {
        let firstContent = this.getFirstContent(contents, links);
        let nextContent = firstContent;
        let orderedContents = [firstContent]
        links.map( link => {
        let auxLink = this.getLinkWithOrigin(links, nextContent);
        nextContent = this.getContentByName(auxLink.destination, contents);
        orderedContents.push(nextContent);
        })
        return orderedContents;     
    }

    getFirstContent(contents, links){ //returns the content that is no destination for any link but that is origin of one. contents out of the flow are ignored
        return contents.filter( content => {
          return links.filter( link => link.destination.toLowerCase() === content.getName().toLowerCase()).length === 0 &&
                 links.filter( link => link.origin.toLowerCase() === content.getName().toLowerCase()).length === 1
        })[0];
      }

      getLinkWithOrigin(links, content){
        return links.filter(link => link.origin.toLowerCase() === content.getName().toLowerCase())[0]
      }
      
      getContentByName(contentId, contents){
        return contents.filter(content => content.hasName(contentId))[0]
      }      

}