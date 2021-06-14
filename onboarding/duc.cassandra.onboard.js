const cassandraDriver = require('cassandra-driver');

/* Characteristics
1. keyspace ~ db
2. column family ~ row
3. row key ~ primary key
4. column name ~ column name
5. column value ~ col val
*/

/**
 *  
 
 1. Create keyspace 
 create keyspace tiki with replication ={'class':'SimpleStrategy','replication_factor':1};
 
 2. Create table 
 create table product(
    proId int primary key,
    proName text,
    price int,
    avatarUrl text,
    catName text
 );

  3. Select
  use tiki;
  select * from product;

  4. Insert
  insert into product () values ();




  5.  Start CLI with username & password
  cqlsh -u cass -p cass;


  
 * 
 */

const db = new cassandraDriver.Client({
  contactPoints: ['h1', 'h2'],
  localDataCenter: 'datacenter1',
  keyspace: 'ks1'
});

var assert = require('assert');
//”cassandra-driver” is in the node_modules folder. Redirect if necessary.
var cassandra = require('cassandra-driver');
//Replace Username and Password with your cluster settings
var authProvider = new cassandra.auth.PlainTextAuthProvider(
  'Username',
  'Password'
);
//Replace PublicIP with the IP addresses of your clusters
var contactPoints = ['PublicIP', 'PublicIP', 'PublicIP’'];
var client = new cassandra.Client({
  contactPoints: contactPoints,
  authProvider: authProvider,
  keyspace: 'grocery'
});

//Ensure all queries are executed before exit
function execute(query, params, callback) {
  return new Promise((resolve, reject) => {
    client.execute(query, params, (err, result) => {
      if (err) {
        reject();
      } else {
        callback(err, result);
        resolve();
      }
    });
  });
}

//Execute the queries
var query =
  'SELECT name, price_p_item FROM grocery.fruit_stock WHERE name=? ALLOW FILTERING';
var q1 = execute(query, ['oranges'], (err, result) => {
  assert.ifError(err);
  console.log('The cost per orange is');
});
