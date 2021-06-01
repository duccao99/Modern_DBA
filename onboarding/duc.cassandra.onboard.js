const cassandraDriver = require('cassandra-driver');

/* Characteristics
1. keyspace ~ db
2. column family ~ row
3. row key ~ primary key
4. column name ~ column name
5. column value ~ col val
*/

const db = new cassandraDriver.Client({
  contactPoints: ['h1', 'h2'],
  localDataCenter: 'datacenter1',
  keyspace: 'ks1'
});
