const DocumentClient = require("./documentClinet");
const uuid = require("uuid");

const TableName = "myapplication";

const getUserByIdDb = async (id) => {
  const params = {
    TableName,
    Key: {
      type: "User",
      id,
    },
  };

  return new Promise((resolve, reject) => {
    DocumentClient.get(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.Item);
      }
    });
  });
};

const getImageByIdDB = async (id) => {
  const params = {
    TableName,
    Key: {
      type: "Image",
      id,
    },
  };

  return new Promise((resolve, reject) => {
    DocumentClient.get(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.Item);
      }
    });
  });
};

const getImagesByTag = async (userId, folder) => {
  const params = {
    TableName,
    Key: {
      type: "Image",
    },
    FilterExpression: "userId = :userId AND folder = :folder",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":folder": folder,
    },
  };

  return new Promise((resolve, reject) => {
    DocumentClient.scan(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.Items);
      }
    });
  });
};

const addUserToDb = async (email, password) => {
  return await DocumentClient.put({
    TableName,
    Item: {
      type: "User",
      id: uuid.v4(),
      email: email,
      password: password,
      tags: [],
    },
  }).promise();
};

const getUserByEmailDb = async (email) => {
  const params = {
    TableName,
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  return new Promise((resolve, reject) => {
    DocumentClient.scan(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.Items);
      }
    });
  });
};

const addImageDetailsToDb = async (data) => {
  return await DocumentClient.put({
    TableName,
    Item: {
      type: "Image",
      ...data,
    },
  }).promise();
};

module.exports = {
  addUserToDb,
  getUserByEmailDb,
  getUserByIdDb,
  addImageDetailsToDb,
  getImagesByTag,
  getImageByIdDB,
};
