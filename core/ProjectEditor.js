class projectEditor {
	constructor(){
        if(arguments){
            this._projectSettings = arguments;
        }
	}



    //this all belongs in flowEditor
    //reordering
    set transformationFlow(flow) {
        this._projectSettings.TranformFlow = flow;
    }
    //loading to site
    get transformationFlow() {
        return this._projectSettings.TranformFlow;
    }
    //individualStep used in debugger
    getTransformScript(stepId) {
        return JSON.parse(fs.readFileSync(this._projectHome + '/transfomations/' + stepId, 'utf8'))
    }
    saveTransformScript(stepId, objString) {
        fs.writeFile(this._projectHome + '/transfomations/' + stepId, objString, function(err) {
            if (!err) {
                console.log('Saved!')
            } else {
                console.log('Error', err);
            }
        })
    }

}