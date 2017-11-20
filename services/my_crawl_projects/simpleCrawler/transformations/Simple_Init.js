//this example appears to be completely syncronous, and does not appear to be aware at all that its wrapped as a promis
//in this case the returned objects gets resolved, 

//warning, since object properties are passed by reference....its recommended to make a deep copy of an object before transforming
//JSON.parse(JSON.stringify(obj));
module.exports = function(obj) {
    let ModifiedObj = JSON.parse(JSON.stringify(obj));
    this.debug('In step 1', __filename);
    ModifiedObj.data.Modified = 'Step1 was here!';
    if(ModifiedObj.state == 'skipMe') {
        throw ("oh no!")
    }else{
    	    ModifiedObj.state = "Modified by step 1";
    }

    return ModifiedObj;
}