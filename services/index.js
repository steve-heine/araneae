const araneaProjectMan = require('./core/ProjectManager')

var myAraneaProject = new araneaProjectMan('simpleCrawler');

var sampleCrawlItem = {
    state: 'new',
    type: 'someCrawlDocuemnt',
    data: { url: 'https://www.amazon.com/gp/product/B003N1ZSYG/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1' }
};


for (i of Array(1185).keys()) {
    myAraneaProject.flow.enqueue(sampleCrawlItem);
}

//deep clone...add condition to get the item skipped
let skipItems = JSON.parse(JSON.stringify(sampleCrawlItem));
skipItems.state = 'skipMe';

for (i of Array(1115).keys()) {
    myAraneaProject.flow.enqueue(skipItems);
}
myAraneaProject.flow.enqueue(sampleCrawlItem, 20, function() {
    myAraneaProject.debug('debug this one...')
});