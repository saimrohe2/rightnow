const mongoose = require('mongoose');
require('dotenv').config();

// Import all the models and data files
const Scenario = require('./models/Scenario');
const Article = require('./models/Article');
const scenariosData = require('./scenarios-data');
const articlesData = require('./articles-data');

const seedDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected for seeding...');

    // --- Seed Scenarios ---
    await Scenario.deleteMany({});
    console.log('Old scenarios deleted.');
    await Scenario.insertMany(scenariosData);
    console.log(`${scenariosData.length} new scenarios have been added successfully!`);

    // --- Seed Articles ---
    await Article.deleteMany({});
    console.log('Old articles deleted.');
    await Article.insertMany(articlesData);
    console.log(`${articlesData.length} new articles have been added successfully!`);


  } catch (error) {
    console.error('Error while seeding the database:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

seedDatabase();