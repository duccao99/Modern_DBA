const neo4jDriver = require('neo4j-driver');

/**
 * Command
 *
 * 1. Find  a person
 * match (tom:Person)
 * where tom.name = "Tom Hanks"
 * return tom;
 *
 * 2. Find a movie with title
 * match (potter:Movie {title:"potter"})
 * return potter;
 *
 * 3. Find 10 person name
 * match (people:Person)
 * return people.name
 * limit 10;
 *
 * 4. Find title of movies that between 1990-2000
 * match (nineTies:Movie)
 * where nineTies.released > 1990
 * and nineTies.released < 2000
 * return nineTies.title;
 *
 * 5. List all Tom Hanks have relationship with movies
 * match (tom:Person {name:"Tom Hanks"})
 * -[:ACTED_IN]
 * ->(tomMovies)
 * return tom, tomMovies;
 *
 * 6. List all directors name of the Cloud Atlas film
 * match (mv:Movie {title:"Cloud Atlas"})
 * <-[:DIRECTED]
 * -(directors)
 * return directors.name;
 *
 * 7. Find all co-actors of Tom Hanks
 * match (tom:Person {name:"Tom Hanks"})
 * -[:ACTED_IN]
 * ->(movies)
 * <-[:ACTED_IN]
 * -(coActors)
 * return tom,movies,coActors;
 *
 *
 * 8. How people are related to Cloud Atlas film
 * match (people:Person)
 * -[relatedTo]
 * -(:Movie {title:"Cloud Atlas"})
 * return people.name, type(relatedTo), relatedTo
 *
 * 9. Delete all node
 * match (n)
 * detach
 * delete n;
 *
 * 10. Verify that the movie graph data is gone
 * match (n)
 * return count(*);
 *
 *
 */

var driver = neo4jDriver.driver(
  'neo4j://localhost',
  neo4j.auth.basic('neo4j', 'password')
);

driver.close();
