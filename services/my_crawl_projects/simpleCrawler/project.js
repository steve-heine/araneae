var projectSettings = {
    name: 'Simple Crawler',
    description: 'Walks all GC APIs',
    status: true,
    debug: true,
    InputCollectors: [{
        internalCollector: 'false', //optional, default:true. When false a folder matching CollectorModule name should be in collectors path
        collectorModule: 'myApp_API_Walker', //name of folder, project start file should be index.js
        startType: 'schedule,api', //coma delimited options schedule, api, auto
        cronSchedules: ['0 0 5 * *'], //optional if has a schedule
        parameters: {
            seedUrls: ['http://aws.someurl.com/someESdomain/']
        }
    }, {
        collectorModule: 'AWS_SQS_LongPoll', //<--leverage a core collector...part of aranea's repo
        startType: 'auto',
        parameters: {
            queueARN: 'arn::someARN',
            account: 'account',
            region: 'region',
            pollSecs: '30'
        }
    }],
    FlowConcurrency: 50,
    "TranformFlow": [{
            "StepName": "Step1",
            matchCondition: function(obj, res) {
                this.debug('WAIT A SECOND')
                setTimeout(function() { res(true) }, 150)
            },
            "transformer": "Simple_Init.js"
        },
        {
            "StepName": 'Step2',
            matchCondition: function(obj) {
                return obj.state != "new"
            },
            "transformer": "Step_2.js"
        },
        {
            "StepName": 'Step2',
            matchCondition: function(obj) {
                return obj.state != "new"
            },
            "transformer": "Step_2.js" //again...
        }
    ],
    onComplete: function(project) { /* Executes when the transformflow queue is empty*/
        let stats = project.flow.stats;
        console.log(Array(110).join('#') + '\nItem processing complete!\n', stats);
        let totalDuration = Math.abs((stats.startTime.getTime() - new Date().getTime()) / 1000);
        console.log('Total Duration:', totalDuration, ' seconds')
    },

};
module.exports = projectSettings;