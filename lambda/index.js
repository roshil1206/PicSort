const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
});

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

const getIDFromKey = (key) => {
  const regex = /\/([a-fA-F0-9-]+)\.[^.\/]+$/;
  const match = key.match(regex);
  return match[1];
};

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TableName = "myapplication";

const getImageById = async (id) => {
  const params = {
    TableName,
    Key: {
      type: "Image",
      id,
    },
  };

  return new Promise((resolve, reject) => {
    dynamoDB.get(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.Item);
      }
    });
  });
};

const getUserById = async (id) => {
  const params = {
    TableName,
    Key: {
      type: "User",
      id,
    },
  };

  return new Promise((resolve, reject) => {
    dynamoDB.get(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.Item);
      }
    });
  });
};

const updateImageEntryDB = async (key, tags, folder) => {
  const params = {
    TableName,
    Key: {
      type: "Image",
      id: key,
    },
    UpdateExpression: "SET #tags = :newTags, #folder = :newFolder",
    ExpressionAttributeNames: {
      "#tags": "tags",
      "#folder": "folder",
    },
    ExpressionAttributeValues: {
      ":newTags": tags,
      ":newFolder": folder,
    },
    ReturnValues: "ALL_NEW",
  };

  return new Promise((resolve, reject) => {
    dynamoDB.update(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const appendTagToUser = async (id, tags) => {
  const params = {
    TableName,
    Key: {
      type: "User",
      id: id,
    },
    UpdateExpression: "SET #tags = list_append(#tags, :newTags)",
    ExpressionAttributeNames: {
      "#tags": "tags",
    },
    ExpressionAttributeValues: {
      ":newTags": tags,
    },
    ReturnValues: "ALL_NEW",
  };

  return new Promise((resolve, reject) => {
    dynamoDB.update(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.handler = async (event, context) => {
  try {
    const S3Details = event.Records[0].s3;
    const a = await s3
      .getObject({
        Bucket: S3Details.bucket.name,
        Key: S3Details.object.key,
      })
      .promise();
    const params = {
      Image: {
        Bytes: a.Body,
      },
      MaxLabels: 5,
      MinConfidence: 70,
    };
    const { Labels } = await rekognition.detectLabels(params).promise();

    const Tags = Labels.map((label) => label.Name);
    const selectedTag = Tags[0];

    const id = getIDFromKey(S3Details.object.key);

    const imageData = await getImageById(id);
    const userDetails = await getUserById(imageData.userId);

    const foundTag = userDetails.tags.filter((element) =>
      Tags.includes(element)
    )[0];

    if (foundTag) {
      await updateImageEntryDB(id, Tags, foundTag);
    } else {
      await updateImageEntryDB(id, Tags, selectedTag);
    }

    await updateImageEntryDB(id, Tags, selectedTag);

    const isTagIncludedWithUser = userDetails.tags.includes(selectedTag);
    if (!isTagIncludedWithUser) {
      await appendTagToUser(imageData.userId, [selectedTag]);
    }

    return { userDetails };
  } catch (err) {
    console.log(err);
    return { err };
  }
};
