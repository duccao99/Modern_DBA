const neo4jDriver = require('neo4j-driver');

var driver = neo4jDriver.driver(
  'neo4j://localhost',
  neo4j.auth.basic('neo4j', 'password')
);

driver.close();
