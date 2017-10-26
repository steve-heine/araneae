const asynclib = require('async');
class FlowProcessor {
    constructor(projectName) {
        this.projectHome = (__dirname + '/../crawl_projects/' + projectName + '/');
        this.projectSettings = this.loadProjectModule("project.js");
        this._q = asynclib.priorityQueue(async(crawlObj, done) => {
            await this._promisify(this.processItem, crawlObj);
            done();
        }, this.projectSettings.FlowConcurrency || 1)
        this.processedItems = 0;
        this.skippedItems = 0;
    }
    get itemsInQueue() { return this._q._tasks.length; }
    debug() { if (this.projectSettings.debug) { console.log(...arguments) } }
    enqueue(crawlObj, priority, cb) {
        priority = priority || 1;
        this.debug('Enqueued Item:', crawlObj)
        this._q.push(crawlObj, priority, cb);
    };
    loadProjectModule(modulePath) { return require(this.projectHome + modulePath); }
    _promisify(method, parseObj) {
        return new Promise((resolve, reject) => {
            let res = method.call(this, parseObj, resolve, reject);
            if (res) { resolve(res); }
        });
    }
    async _transform(stepIdx, parseObj) {
        let stepObject = this.projectSettings.TranformFlow[stepIdx];
        if (await this._promisify(stepObject.matchCondition, parseObj)) {
            parseObj = await this._promisify(this.loadProjectModule("transformations/" + stepObject.transformer), parseObj);
        }
        return parseObj
    }
    async processItem(crawlObj, stepIdx) {
        stepIdx = (typeof stepIdx == 'function' ? 0 : stepIdx);
        this.debug(`\n--Transform Step: ${stepIdx +1 } [ ${this.projectSettings.TranformFlow[stepIdx].StepName} ]--\n\n Data In-->\n`,
            crawlObj, '\n\n--begin step--\n')
        try {
            let respObj = await this._transform(stepIdx, crawlObj);
            crawlObj = respObj || crawlObj;
            this.debug('\n--end step--\n\nData Out->>\n', crawlObj)
            if (stepIdx < (this.projectSettings.TranformFlow.length - 1))
                await this.processItem(crawlObj, stepIdx + 1);
            else {
                this.processedItems++;
            }
        } catch (e) {
            this.skippedItems++;
            this.debug(`Crawl object was rejected in step [${this.projectSettings.TranformFlow[stepIdx].StepName}] with message: `, e)
        }
    }
}
module.exports = FlowProcessor;