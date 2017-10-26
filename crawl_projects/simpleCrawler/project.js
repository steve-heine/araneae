var projectSettings = {
    name: 'Simple Crawler',
    description: 'Walks all GC APIs',
    status: true,
    debug: true,
    Collectors: [{
            type: 'custom',
            startType: 'schedule',
            cronSchedules: ['0 0 5 * *'],
            collectorModule: 'my_API_Walker',
            seedUrls: ['http://aws.someurl.com/someESdomain/']
        },
        {
            type: 'AWS_SQS_LongPoll',
            startType: 'auto',
            queueARN: 'arn::someARn',
            account: 'account',
            region: 'region',
            aws_creds: { profile: 'trp-shared-dev-admin' },
            pollSecs: '30'
        }
    ],
    FlowConcurrency:1,
    "TranformFlow": [{
            "StepName": "Step1",
            matchCondition: function(obj,res) {
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

        }
    ]
};
module.exports = projectSettings;