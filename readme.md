What is Araneae

	Araneae is a modular framework to simplify writing data collection spiders/flows, transforms and writes to some sort of store (ElasticSearch, ElasticCache, Splunk, a Database etc)

	Araneae runs in a Node JS 8.6+, taking advantage of the vast ecosystem of node modules, the powerful json manipulation capabilities, the asyncronous nature of the nodejs architecture, the async/await and promise capabilities offered in ecma2015 and ecma7, and the ease of use of the javascript language.


	Leveraging the spawn library, its easy to extend a transformation process with third party languages and tools such as python or java utilities by running the spawn module

	Araneae has a decoupled collector process and transformation process. This allows you to have multiple means of data input (queue, api, simple crawler etc), all the while processing. Araneae also is data store agnostic. This allows you to implement any structure/schema you want when storing your data.



Best Practices
1. Don't modify the aranea core, if you feel that you need to, create a fork of the git repo, and submit a pull request for your changes. If you 
If you need an asyncronous process to test your condition, keep the condition as simple as possible and put the check inside of the transformer. Remember to return the object in an unmodified state if this condition is not true.




Project.js structure

/*
A project definition is an object containing the following properties
	-name
	-descritpion [optional]
	-status
	-debug [optional]
	-Collectors array of Collector Definitions (each collector module should contain its own read me as properties will vary dependent on type) 
		standard properties include
			-type
			-startType [schedule, API, auto, manual]
			-cronSchedules [when start will be executed on collector]
	-TransformFlow [array of transform steps. See 'Writing transform steps' for mor information]

*/

var projectSettings = {
    name: 'Simple Crawler',
    description: 'Walks all GC APIs',
    status: true,
    debug: true,
    Collectors: [{
            type: 'custom',
            startType:'schedule, API',
            cronSchedules:['0 0 5 * *'],
            collectorModule:'GrandCentral_API_Walker',
            seedUrls: ['http://aws.someurl.com/someESdomain/']
        },
        {
            type: 'AWS_SQS_LongPoll',
            startType:'auto',
            queueARN: 'arn::someARn',
            account: 'account',
            region: 'region',
            aws_creds: { profile: 'trp-shared-dev-admin' },
            pollSecs: '30'
        }
    ],
    "TranformFlow": [{
            "StepName": "Step1",
            matchCondition: function(obj,res) {
                return true
            },
            "transformer": "Simple_Init.js"
        },
        {
            "StepName": 'Step2',
            matchCondition: function(obj) {
                return obj.state != "new"
            },
            "transformer": "Step_2.js"

        }
    ]
};
module.exports = projectSettings;











Writing a Tranform steps

A step object is made up of 4 properties.
	-StepName //the display name of the step
	-matchCondition //Should the transformation apply?.. returns true or false. This is a promise object that also accepts returns (keep them simple)
	-transformer //the filename of the module in the transformations directory



A transform module has the following structure.

module.exports = function(crawlObject, resolve, reject)
{ 
	//dostuff
	//resolve(modifiedObj)
	// or
	//return modifiedObj;
}

-The method is auto wrapped as a promise, 
-the resolve and reject methods are optional
-cralling reject wil stop the flow process for that specifc item
-a syncronous transform module can return a response instead, or throw an exception in place or calling the reject method
-its a nodejs module, include any additional modules you want (cheerio,aws-sdk etc)
-"this" object context is the instance of flowProcessor, all lexigraphical public properties and methods are availbe including
	-this.projectSettings
	-this.debug
	-this.procesItem (which could be used to trigger parelell items, but note: enqueue item is prefered)
	-

Note: 
 Since properties of are passed by reference, its recommended to make a deep copy of the crawlObject in the event the object may not be modified or an reject/exception may be thrown
//JSON.parse(JSON.stringify(obj));