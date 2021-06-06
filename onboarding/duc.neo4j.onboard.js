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

/**
 * CREATE - command
 *
 * 1. Create a node person
 * create (n:Person {name:"ca heo",age:3});
 *
 * 2. Create a node Animal - Dog
 * create (ret:Animal {type:"Dog", legs:4})
 *
 * 3. Create relationship between two node (a->b)
 * // Create a friend relationship between duccao & khahuy
 * match
 * (a:Person),
 * (b:Person)
 * where a.name = 'duccao'
 * and b.name = 'khahuy'
 * create (a)-[r:FRIEND]->(b)
 * return type(r);
 *
 * 4. Create properties in relationship
 * match
 * (a:Person),
 * (b:Person)
 * where a.name = 'duccao'
 * and b.name = 'khahuy'
 * create (a)-[r:FRIEND {highSchool:"Ly Tu Trong", interested:"League Of Legend"}] ->(b)
 * return type(r)
 *
 *
 * 5. Create relationship that full path
 * create p =
 * (andy {name:"Andy"})-[:WORKS_AT]->(neo)<-[:WORKS_AT]-(michael {name:"Michael"})
 * return p;
 *
 *
 * 6. Create a noe with parameter for the properties
 * {
      "props" : {
      "name" : "Andy",
      "position" : "Developer"
      }
    }


    create (n:Person $props)
    return n;
 * 
 */

/**
*   DELETE Command 
* 1. Delete a node
    match (n:Person {name:"duc"})
    delete n;

  2. delete a node with all its relationship
  match (n:{name:"duc"})
  detach
  delete n;

  3. delete relationship only
  match (n:{name:"duc"})-[r:KNOWS]->()
  delete r;


* 
*/

var driver = neo4jDriver.driver(
  'neo4j://localhost',
  neo4j.auth.basic('neo4j', 'password')
);

driver.close();
