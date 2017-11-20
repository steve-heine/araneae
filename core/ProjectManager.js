const flowProcessor = require('./FlowProcessor');
class araneaProjectManager {
    constructor(projectName) {
        if (projectName) {
            this.loadProject(projectName)
        } else {
            this.autoloadProjects();
        }
    }
    loadProject(projectName) {
        this.flow = new flowProcessor(projectName, this);
        this.aliasHelpers();
        this.debug('Project ', this.projectSettings.name, ' settings loaded.')
        this.bootstrapStartupProcesses();
    }
    aliasHelpers(){
    	//alias flow processor helpers here
        this.projectSettings = this.flow.projectSettings;
        this._promisify = this.flow._promisify;
        this.debug = this.flow.debug;
    }
    autoloadProjects() {
        this.debug("Loading all project Definitions");
        //find project folders
        //loop through
        //pass to loadProject(project)
    }
    bootstrapStartupProcesses() {
        this.loadCollectors();
        this.initializeService();
        this.startScheduler();
        this.drain = () => { completionHandler(); }
    }
    async loadCollectors() {
        this.debug("Loading Project Collectors...")
    }
    async startScheduler() {
        this.debug("Starting scheduler")
    }
    async initializeService() {
        this.debug('Initializing services')
        //pull stats data from store
    }
    //when flow queue is drained apply
    async completionHandler() {
        this.debug('Apply onComplete method')
        if (this.projectSettings.onComplete && (this.state && this.state != 'running')) {
            this.projectSettings.onComplete.apply(this, this.state);
        }
    }
}

module.exports = araneaProjectManager;