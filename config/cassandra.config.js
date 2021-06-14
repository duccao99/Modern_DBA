const cassandraDriver = require('cassandra-driver');

// get contact point when start cqlsh command
const contactPoints = ['http://localhost:1212', '127.0.0.1:9042'];

//  cqlsh -u cass -p cass;
const authProvider = new cassandraDriver.auth.PlainTextAuthProvider(
  'cass',
  'cass'
);

const client = new cassandraDriver.Client({
  contactPoints,
  authProvider,
  localDataCenter: 'datacenter1',
  keyspace: 'tiki'
});

function execute(sql, params, cb) {
  return new Promise((resolve, reject) => {
    client.execute(sql, params, (er, ret) => {
      if (er) {
        cb(er);
        reject(er);
      } else {
        cb(null, ret);
        resolve(ret);
      }
    });
  });
}

const cassandraConfig = {
  getProduct: (cb) => {
    const sql = 'SELECT * from product';

    client
      .execute(sql, [], {})
      .then((ret) => {
        console.log(ret);

        cb(null, ret.rows);
      })
      .catch((er) => {
        console.log(er);
        cb(er);
      });
  }
};

module.exports = cassandraConfig;
