const AWS = require("./AWS");

const cloudfront = new AWS.CloudFront();

const getCloudFrontDomain = async () => {
  const distributions = await cloudfront.listDistributions().promise();
  const distributionList = distributions.DistributionList.Items[0];
  const domainName = distributionList.DomainName;
  return domainName;
};

module.exports = { getCloudFrontDomain };
