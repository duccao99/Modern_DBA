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
  getFullProductDetail: async (cb, proId) => {
    const session = driver.session();

    console.log(proId);
    const query_try_1 = `
    match (p:Product),
    (c:Category),
    (p2:Product)
    where (p)-[:BELONG_TO]->(c)<-[:BELONG_TO]-(p2)
    and p.proId="60b4e7849fee800540447318"
    and p2.proId <>  "60b4e7849fee800540447318"
    return p as productDetail, p2 as relativeProducts,c as cat;
    `;

    const query_try_2 = `
    match (p:Product),
    (c:Category)
    where (p)-[:BELONG_TO]->(c)
    and p.proId="${proId}"
    return p,c;
    `;

    const query_try_3 = `
    match (p:Product {proId:"${proId}"})
-[:BELONG_TO]->(c:Category)<-[:BELONG_TO]-(p2:Product)
return p as proDetail, c as at, p2 as relativeProducts;

    `;

    const para = {};

    session.run(query_try_3, para, {}).then((ret) => {
      cb(null, ret.records);
    });

    // driver.close();
  },

  getProductDetail: async (cb, proId) => {
    const query = `
    match (p:Product),
    (c:Category)
    where (p)-[:BELONG_TO]->(c)
    and p.proId="${proId}"
    return p,c;
    `;
    const para = {};

    const session = driver.session();

    session.run(query, para, {}).then((ret) => {
      cb(null, ret.records);
    });
  }
};

module.exports = neo4jConfig;
