
const flowProcessor = require('./core/FlowProcessor')
//Write logic to find child folders of simpleCrawler and auto load flowProcessors
//test public methods
var fp = new flowProcessor('simpleCrawler');
var crawlItem = {
    state: 'new',
    type: 'someCrawlDocuemnt',
    data: { url: 'https://www.amazon.com/gp/product/B003N1ZSYG/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1' }
};
const startTime = new Date();

let skipItems = JSON.parse(JSON.stringify(crawlItem));
skipItems.state = 'skipMe';

for (i of Array(85).keys()){
	fp.enqueue(crawlItem);
}
for (i of Array(15).keys()){
	fp.enqueue(skipItems);
}
fp.enqueue(crawlItem,20, function() {
    fp.debug('###########################################################################################################################################\nItem processing complete!',
    	'\nItems In Queue:', fp.itemsInQueue,
    	'\nProcessed Items:', fp.processedItems,
    	'\nSkipped Items:',fp.skippedItems);
    let totalDuration = Math.abs((startTime.getTime() - new Date().getTime()) / 1000);
    fp.debug('Total Duration:', totalDuration, ' seconds')
});
