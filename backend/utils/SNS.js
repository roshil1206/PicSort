const AWS = require("./AWS");
const sns = new AWS.SNS();

const shootEmail = async (error) => {
  const { Topics } = await sns.listTopics().promise();

  const arn = Topics.filter((topic) =>
    topic.TopicArn.includes("application-error-alert")
  )[0];

  const messageParams = {
    Message: error,
    TopicArn: arn.TopicArn,
  };
  const a = await sns.publish(messageParams).promise();
};

module.exports = { shootEmail };
