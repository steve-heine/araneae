//a transformation step will have a resolve and reject argument injected.
//Call the resolve method if an async operation is going to occur before returning your changes
//a rejection will stop the flow process for the current object, and the object will be discarded
var Transformation = function(obj, resolve, reject) {
    const cheerio = require('cheerio');
    this.debug('Project Settings', this.projectSettings);
    setTimeout(() => {
        if (cheerio) {
            obj.state += " & step 2";
            obj.data.Modified += ' & step 2 was too!';
            resolve(obj);
        }else{
        	reject({action:'drop',msg:'not what i expected....'})
        }
    }, 150);
}
module.exports = Transformation;