// utils/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

let connections = {};
let models = {};
let isConnected = false;

const connectDB = async (dbName) => {
  const uriEnvVar = `MONGODB_${dbName.toUpperCase()}_URI`;
  const uri = process.env[uriEnvVar];
  if (!uri) {
    throw new Error(`${uriEnvVar} is not defined in the environment variables`);
  }
  try {
    const connection = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`${dbName} MongoDB connected`);
    connections[dbName] = connection;
    return connection;
  } catch (error) {
    console.error(`${dbName} MongoDB connection error:`, error);
    throw error;
  }
};

const connectDBs = async () => {
  if (isConnected) {
    return;
  }
  try {
    await Promise.all([
      connectDB('users'),
    //   connectDB('lenskart_workers'),
    //   connectDB('lenskart_admins'),
    //   connectDB('manufacturers'),
    //   connectDB('common')
    ]);
    isConnected = true;
    console.log('All databases connected successfully');
  } catch (error) {
    console.error('Failed to connect to one or more databases:', error);
    throw error;
  }
};

const getConnection = (dbName) => {
  if (!isConnected) {
    throw new Error('Databases are not connected. Call connectDBs first.');
  }
  if (!connections[dbName]) {
    throw new Error(`Connection to ${dbName} database not established`);
  }
  return connections[dbName];
};

const registerSchema = (dbName, modelName, schema) => {
  const connection = getConnection(dbName);
  if (!models[dbName]) {
    models[dbName] = {};
  }

  // Check if schema is already a model
  if (schema.prototype instanceof mongoose.Model) {
    models[dbName][modelName] = schema;
  } else {
    // If it's a schema, create a model
    models[dbName][modelName] = connection.model(modelName, schema);
  }
};

const getModel = (dbName, modelName) => {
  if (!connections[dbName]) {
    throw new Error(`Connection to ${dbName} database not established`);
  }
  if (!models[dbName] || !models[dbName][modelName]) {
    throw new Error(`Model ${modelName} for ${dbName} database not registered`);
  }
  return models[dbName][modelName];
};

module.exports = { connectDBs, getConnection, registerSchema, getModel };
