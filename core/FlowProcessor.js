const asynclib = require('async');
class araneaFlowProcessor {
    constructor(projectName, projectManager) {
        this.projectManager = projectManager;
        this.projectHome = (__dirname + '/../crawl_projects/' + projectName + '/');
        this.projectSettings = this.loadProjectModule("project.js");
        this._q = asynclib.priorityQueue(async(crawlObj, done) => {
            await this.processItem(crawlObj, 0);
            done();
        }, this.projectSettings.FlowConcurrency || 1)
        this.resetStats();
        this.onComplete = this.projectSettings.onComplete || (() => {});
        this._q.drain = () => { 
            //emit an onComplete event
            this.onComplete(this.projectManager) 
        }
    }
    resetStats() { this._stats = { processedItems: 0, skippedItems: 0, startTime: null }; }
    get stats() {
        return {
            itemsInQueue: this._q._tasks.length,
            processedItems: this._stats.processedItems,
            skippedItems: this._stats.skippedItems,
            startTime: this._stats.startTime
        }
    }
    debug() { if (this.projectSettings.debug) { console.log(...arguments) } }
    enqueue(crawlObj, priority, cb) {
        this._stats.startTime = this._stats.startTime || new Date();
        priority = priority || 1;
        this.debug('Enqueued Item:', crawlObj)
        this._q.push(crawlObj, priority, cb);
    };
    loadProjectModule(modulePath) { return require(this.projectHome + modulePath); }
    _promisify(method, parseObj) {
        return new Promise((resolve, reject) => {
            let resp = method.call(this.projectManager, parseObj, resolve, reject);
            if (resp) { resolve(resp); }
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
        stepIdx = stepIdx || 0;
        this.debug(`\n--Transform Step: ${stepIdx +1 } [ ${this.projectSettings.TranformFlow[stepIdx].StepName} ]--\n\n Data In-->\n`,
            crawlObj, '\n\n--begin step--\n')
        try {
            let respObj = await this._transform(stepIdx, crawlObj);
            crawlObj = respObj || crawlObj;
            this.debug('\n--end step--\n\nData Out->>\n', crawlObj)
            if (stepIdx < (this.projectSettings.TranformFlow.length - 1))
                await this.processItem(crawlObj, stepIdx + 1);
            else {
                this._stats.processedItems++;
            }
        } catch (e) {
            this._stats.skippedItems++;
            this.debug(`Crawl object was rejected in step [${this.projectSettings.TranformFlow[stepIdx].StepName}] with message: `, e)
        }
    }
}
module.exports = araneaFlowProcessor;