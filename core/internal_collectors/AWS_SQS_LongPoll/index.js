var AWS = require('aws-sdk');
var sqs = {};
sqs = new AWS.SQS({ region: properties.get('aws.region'), httpOptions: myHttpOptions, credentials: localCredentials });
class AWS_SQS_LongPoll {
    constructor(projectManager, config) {
        this.config = config;
        this.projManager = projectManager;
        this.debug = this.projManager.debug;
    }

    getQueueURL() {
        return new Promise((resolve, reject) => {
                try {
                    sqs.getQueueUrl(params, function(err, data) {
                        if (err) {
                            this.debug(err, err.stack); // an error occurred
                            throw err
                        } else {
                            this.debug('Queue URL:', data); // successful response
                            resolve(data.QueueUrl)
                        }
                    });
                } catch (e) {
                    this.debug('Error:', e)
                    reject({ error: 'Something bad happened!' })
                }
            }

        }


    }
    async longPollEventQueue() {
        let sqsQueueUrl = await getQueueURL();
        pm.debug(payload, 'Polling queue: ' + sqsQueueUrl)
        var params = {
            QueueUrl: sqsQueueUrl,
            MaxNumberOfMessages: 5,
            MessageAttributeNames: [
                '.*',
            ],
            ReceiveRequestAttemptId: guid(),
            WaitTimeSeconds: 20
        };
        sqs.receiveMessage(params, function(err, data) {
            if (err) {
                Logger.info(payload, err, err.stack);
                setTimeout(function() {
                    self.longPollEventQueue(sqsQueueUrl);
                }, 15000)
            } else {
                // successful response
                if (data.Messages && data.Messages.length > 0) {
                    self.processMessages(sqsQueueUrl, data, function() {
                        self.longPollEventQueue(sqsQueueUrl);
                    })
                } else {
                    pm.debug(payload, 'No messages, continue polling')

                    self.longPollEventQueue(sqsQueueUrl);
                }
            }

        });
    }


}