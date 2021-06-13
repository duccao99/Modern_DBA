const neo4jDriver = require('neo4j-driver');

var driver = neo4jDriver.driver(
  'bolt://localhost:7687',
  neo4jDriver.auth.basic('duc', 'duc')
);

const neo4jConfig = {
  getPersonName: async (cb) => {
    const session = driver.session();

    const query = `match (p:Person) return p;`;
    const para = {};
    session.run(query, para, {}).subscribe({
      onKeys: (keys) => {
        // console.log(keys);
      },
      onNext: (record) => {
        // console.log(record);
      },
      onCompleted: (ret) => {
        console.log(ret);
        const data = ret.database;

        session.close(); // returns a Promise

        cb(null, data);
      },
      onError: (error) => {
        console.log(error);
        // cb(error);
      }
    });
    session.run(query, para, {}).then((ret) => {});

    // driver.close();
  },
  getProductDetail: async (cb) => {
    const session = driver.session();

    const query = `match (n:Product) return n;`;
    const para = {};
    // session.run(query, para, {}).subscribe({
    //   onKeys: (keys) => {
    //     // console.log(keys);
    //   },
    //   onNext: (record) => {
    //     cb(null, record._fields);

    //     session.close(); // returns a Promise
    //   },
    //   onCompleted: (ret) => {},
    //   onError: (error) => {
    //     console.log(error);
    //     // cb(error);
    //   }
    // });

    session.run(query, para, {}).then((ret) => {
      cb(null, ret.records);
    });

    // driver.close();
  }
};

module.exports = neo4jConfig;
