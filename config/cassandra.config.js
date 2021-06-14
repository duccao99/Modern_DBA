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
    const sql = 'SELECT * from product;';

    client
      .execute(sql, [], {})
      .then((ret) => {
        // console.log(ret);

        cb(null, ret.rows);
      })
      .catch((er) => {
        console.log(er);
        cb(er);
      });
  },

  bulkInsert: (cb) => {
    const sql = [
      `
    insert into product (proId,proName,avatarUrl,price,category) 
    values ('60b4e68c9fee800540447315','100 cây Keo Nến Keo Nhiệt  dài 24cm dùng cho súng bắn keo 20w'
    ,'https://salt.tikicdn.com/cache/w444/ts/product/45/79/a5/c76398ae87578ca5d9ad9ab609bae49a.jpg'
    ,95000,'Nhà cửa, đời sống');`,
      `  insert into product (proId,proName,avatarUrl,price,category) 
      values ('60b4e7169fee800540447316','Dụng cụ vặn ván trượt Patin chữ T kèm khóa Allen'
      ,'https://salt.tikicdn.com/cache/w444/ts/product/3f/e7/53/cc32b8f9b91e62173fd15bb0a1101da6.jpg',
      33000,'Thể thao, dã ngoại');`,
      ` insert into product (proId,proName,avatarUrl,price,category) 
      values ('60b4e7799fee800540447317','Bộ 2 Thanh RAM PC G.Skill 32GB (16GBx2) LED RGB Tản Nhiệt DDR4 F4-3000C16D-32GTZR - Hàng Chính Hãng'
      ,'https://salt.tikicdn.com/cache/w444/ts/product/3f/e7/53/cc32b8f9b91e62173fd15bb0a1101da6.jpg',
      5346800,'Laptop, vi tính, linh kiện');`,
      `insert into product (proId,proName,avatarUrl,price,category) 
      values ('60b4e7849fee800540447318','Bộ 2 Thanh RAM PC G.Skill 32GB (16GBx2) LED RGB Tản Nhiệt DDR4 F4-3000C16D-32GTZR - Hàng Chính Hãng'
      ,'https://salt.tikicdn.com/cache/w444/ts/product/06/52/27/00294e84ad558ed3dd67a7bd49230bd5.jpg',
      5346800,'Laptop, vi tính, linh kiện');`,
      `  insert into product (proId,proName,avatarUrl,price,category) 
      values ('60b4e78e9fee800540447319','Bộ 2 Thanh RAM'
      ,'https://salt.tikicdn.com/cache/w444/ts/product/06/52/27/00294e84ad558ed3dd67a7bd49230bd5.jpg',
      3000000,'Laptop, vi tính, linh kiện');`
    ];
    for (let i = 0; i < sql.length; ++i) {
      client
        .execute(sql[i], [], {})
        .then((ret) => {
          cb(null, ret.rows);
        })
        .catch((er) => {
          console.log(er);
          cb(er);
        });
    }
  },
  insertProduct: (cb) => {
    const sql = ` insert into product (proId,proName,avatarUrl,price,category) 
    values ('60b4e68c9fee800540447315','100 cây Keo Nến Keo Nhiệt  dài 24cm dùng cho súng bắn keo 20w'
    ,'https://salt.tikicdn.com/cache/w444/ts/product/45/79/a5/c76398ae87578ca5d9ad9ab609bae49a.jpg'
    ,95000,'Nhà cửa, đời sống');`;

    client
      .execute(sql, [], {})
      .then((ret) => {
        cb(null, ret.rows);
      })
      .catch((er) => {
        console.log(er);
        cb(er);
      });
  }
};

module.exports = cassandraConfig;
