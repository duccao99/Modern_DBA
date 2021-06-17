const router = require('express').Router();
const productModel = require('../models/product.model');
const neo4jDriver = require('neo4j-driver');
const neo4jConfig = require('../config/neo4j.config');
const cassandraConfig = require('../config/cassandra.config');
const chalk = require('chalk');
const executionTime = require('execution-time')();

//-------------------------------------------------------
// Mongodb xem ds san pham - them 1 san pham
//-------------------------------------------------------

// xem danh sach san pham - mongodb
router.get('/', async function (req, res) {
  const products = await productModel.find({});

  if (products.length === 0) {
    return res.status(404).json({
      message: 'Product not found!'
    });
  }

  return res.json({
    products
  });
});

// them 1 san pham

router.post('/', async function (req, res) {
  if (
    !req.body.proName ||
    !req.body.avatarUrl ||
    !req.body.price ||
    !req.body.category
  ) {
    return res.status(400).json({ message: 'Invalid data post!' });
  }

  const product = {
    proName: req.body.proName,
    avatarUrl: req.body.avatarUrl,
    price: +req.body.price,
    category: req.body.category
  };

  const ret_add = await productModel.create(product);

  return res.json({
    ret_add_product: ret_add
  });
});

//------------------------------
// Search product - cassandra
//------------------------------

/**
 * Search product design
 * 


 -1.  Active codepage console
 CHCP 65001

  0.  Start CLI with username & password
  cqlsh -u cass -p cass;
 *
 * 1. Create key space
    create keyspace tiki with replication ={'class':'SimpleStrategy','replication_factor':1};
 
 * 2. Create table product
    use tiki;

    create table product(
      proId text primary key,
      proName text,
      avatarUrl text,
      price int,
      category text
    );

  3. Insert data

  insert into product (proId,proName,avatarUrl,price,category) 
  values ('60b4e68c9fee800540447315','100 cây Keo Nến Keo Nhiệt  dài 24cm dùng cho súng bắn keo 20w'
  ,'https://salt.tikicdn.com/cache/w444/ts/product/45/79/a5/c76398ae87578ca5d9ad9ab609bae49a.jpg'
  ,95000,'Nhà cửa, đời sống');

  insert into product (proId,proName,avatarUrl,price,category) 
  values ('60b4e7169fee800540447316','Dụng cụ vặn ván trượt Patin chữ T kèm khóa Allen'
  ,'https://salt.tikicdn.com/cache/w444/ts/product/3f/e7/53/cc32b8f9b91e62173fd15bb0a1101da6.jpg',
  33000,'Thể thao, dã ngoại');

  insert into product (proId,proName,avatarUrl,price,category) 
  values ('60b4e7799fee800540447317','Bộ 2 Thanh RAM PC G.Skill 32GB (16GBx2) LED RGB Tản Nhiệt DDR4 F4-3000C16D-32GTZR - Hàng Chính Hãng'
  ,'https://salt.tikicdn.com/cache/w444/ts/product/3f/e7/53/cc32b8f9b91e62173fd15bb0a1101da6.jpg',
  5346800,'Laptop, vi tính, linh kiện');

  insert into product (proId,proName,avatarUrl,price,category) 
  values ('60b4e7849fee800540447318','Bộ 2 Thanh RAM PC G.Skill 32GB (16GBx2) LED RGB Tản Nhiệt DDR4 F4-3000C16D-32GTZR - Hàng Chính Hãng'
  ,'https://salt.tikicdn.com/cache/w444/ts/product/06/52/27/00294e84ad558ed3dd67a7bd49230bd5.jpg',
  5346800,'Laptop, vi tính, linh kiện');

  insert into product (proId,proName,avatarUrl,price,category) 
  values ('60b4e78e9fee800540447319','Bộ 2 Thanh RAM'
  ,'https://salt.tikicdn.com/cache/w444/ts/product/06/52/27/00294e84ad558ed3dd67a7bd49230bd5.jpg',
  3000000,'Laptop, vi tính, linh kiện');



 */

router.get('/search', async function (req, res) {
  executionTime.start();
  if (!req.query.keyword) {
    return res.status(400).json({
      messsage: 'Keyword invalid!'
    });
  }

  const keyword = req.query.keyword;

  // insert records
  // cassandraConfig.bulkInsert((er, data) => {
  //   // console.log(data);
  // });

  cassandraConfig.getProduct((er, data) => {
    // console.log(data);
    let products = [...data];

    let ret = [];

    for (let i = 0; i < products.length; ++i) {
      console.log(products[i]);
      if (products[i].proname.includes(keyword)) {
        ret.push(products[i]);
      }
    }

    let isEmpty = false;

    products.length === 0 ? isEmpty === true : (isEmpty = false);

    const retTime = executionTime.stop();
    console.log(`Cassandra - Search product execution time: `, retTime.time);

    return res.render('vwHome/vwSearchProduct', {
      layout: 'layout',
      products: ret,
      isEmpty: ret.length === 0 ? true : false
    });
  });
});

//-------------------------
// product detail - neo4j
//-------------------------

router.get('/:id', async function (req, res) {
  executionTime.start();
  const proId = req.params.id;

  neo4jConfig.getFullProductDetail((er, data) => {
    // console.log('Data from neo4j');
    // console.log(data);
    // a.push(data[0].properties);
    // return data[0].properties;

    /**
     * HANDLE JSON DATA FROM NEO4J
     *
     *proName
     *avatarUrl
     *fullDes
     price
     proId
     */

    if (data.length !== 0) {
      let ret = [...data];
      console.log(ret);
      let relativeProducts = ret.map((e) => {
        return e._fields[2].properties;
      });

      ret = ret.map((e) => {
        // console.log(e);
        return e._fields;
        // return e._fields[0].properties;
      });

      const retTime = executionTime.stop();
      console.log(
        chalk.yellowBright(
          `Neo4j - Product Detail execution time is: ` + retTime.time
        )
      );

      res.render('vwProductDetail/vwProductDetail.hbs', {
        layout: 'layout',
        proDetail: ret[0][0].properties,
        cat: ret[0][1].properties,
        relativePro: relativeProducts
      });
    } else {
      neo4jConfig.getProductDetail((er, data) => {
        console.log(data);

        let ret = [...data];
        ret = ret.map((e) => {
          return e._fields;
        });
        // console.log(ret[0]);

        const retTime = executionTime.stop();
        console.log(
          chalk.yellowBright(
            `Neo4j - Product Detail execution time is: ` + retTime.time
          )
        );

        res.render('vwProductDetail/vwProductDetail.hbs', {
          layout: 'layout',
          proDetail: ret[0][0].properties,
          cat: ret[0][1].properties,
          relativePro: []
        });
      }, proId);
    }

    // return res.json({
    //   ret
    // });
  }, proId);

  // res.render('vwProductDetail/vwProductDetail.hbs', {
  //   layout: 'layout',
  //   products,
  //   relativePro: [1, 2, 3]
  // });
});

/**
 * Product detail design
 *
 * 
 * 

// create product

create (p:Product 
{proId:"60b4e68c9fee800540447315",
 proName:"100 cây Keo Nến ( Keo Nhiệt ) dài 24cm dùng cho súng bắn keo 20w",
 price:95000,
 fullDes:"Dài 24cm
Đường kính 0.7cm
Dùng cho loại sung nhỏ 20w
Dài 24cm
Đường kính 0.7cm
Dùng cho loại sung nhỏ 20w

Giá sản phẩm trên Tiki đã bao gồm thuế theo luật hiện hành. Tuy nhiên tuỳ vào từng loại sản phẩm hoặc phương thức, địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như phí vận chuyển, phụ phí hàng cồng kềnh, ...",

 avatarUrl:"https://salt.tikicdn.com/cache/w444/ts/product/45/79/a5/c76398ae87578ca5d9ad9ab609bae49a.jpg"
});




create (p:Product 
{proId:"60b4e7169fee800540447316",
 proName:"Dụng cụ vặn ván trượt Patin chữ T kèm khóa Allen",
 price:33000,
  fullDes:"Hoàn hảo cho hầu như bất kỳ ván trượt.
3 ổ cắm (ở 3 đầu của công cụ hình chữ T-14mm-13mm-8mm) với các kích cỡ khác nhau để thắt chặt và lắp xe tải, bánh xe, vòng bi.
Một tuốc nơ vít phù hợp với tay cầm công cụ.
Thiết kế hình chữ T thân thiện với người dùng để sử dụng thoải mái.
Nhẹ và nhỏ để mang theo.
-Hoàn hảo cho hầu như bất kỳ ván trượt.
- 3 ổ cắm (ở 3 đầu của công cụ hình chữ T-14mm-13mm-8mm) với các kích cỡ khác nhau để thắt chặt và lắp xe tải, bánh xe, vòng bi.
-Một tuốc nơ vít phù hợp với tay cầm công cụ.
-Thiết kế hình chữ T thân thiện với người dùng để sử dụng thoải mái.
-Nhẹ và nhỏ để mang theo.
-Thông số kỹ thuật: Chiều dài: Xấp xỉ. 10.3 cm x 9 cm (L * W)
-Phù hợp cho: đai ốc trục, Đinh chính hình lục giác bên ngoài, đai ốc tiêu chuẩn, sửa vít lục giác bên trong, sửa vít chéo.
 
Giá sản phẩm trên Tiki đã bao gồm thuế theo luật hiện hành. Tuy nhiên tuỳ vào từng loại sản phẩm hoặc phương thức, địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như phí vận chuyển, phụ phí hàng cồng kềnh, ...",
 avatarUrl:"https://salt.tikicdn.com/cache/w444/ts/product/3f/e7/53/cc32b8f9b91e62173fd15bb0a1101da6.jpg"    
});


create (p:Product 
{proId:"60b4e7799fee800540447317",
 proName:"Bộ 2 Thanh RAM PC G.Skill 32GB (16GBx2) LED RGB Tản Nhiệt DDR4 F4-3000C16D-32GTZR - Hàng Chính Hãng",
 price:5346800,
 fullDes:"Tốc độ 3000MHz
Độ trễ CL16-18-18-38
RAM chuẩn: DDR4
Dung lượng: 32GB (16GBx2)
Thiết kế nhỏ gọn, hiện đại
Bộ 2 Thanh RAM PC G.Skill 32GB (16GBx2) Ripjaws Tản Nhiệt DDR4 F4-3000C16D-32GVRB không chỉ được thiết kế với kiểu dáng mới, mà còn còn sở hữu gam màu đỏ rực rỡ, Ripjaws chắc chắn là một lựa chọn tuyệt vời. Đặc biệt, thiết bị được thiết kế với chiều cao mô-đun 42mm phù hợp với hầu hết các tản nhiệt CPU quá khổ.",
 avatarUrl:"https://salt.tikicdn.com/cache/w444/ts/product/3f/e7/53/cc32b8f9b91e62173fd15bb0a1101da6.jpg"    
});






create (p:Product 
{proId:"60b4e7849fee800540447318",
 proName:"Bộ 2 Thanh RAM PC G.Skill 32GB (16GBx2) LED RGB Tản Nhiệt DDR4 F4-3000C16D-32GTZR - Hàng Chính Hãng",
 price:5346800,
 fullDes:"Tốc độ 3000MHz
Độ trễ CL16-18-18-38
RAM chuẩn: DDR4
Dung lượng: 32GB (16GBx2)
Thiết kế nhỏ gọn, hiện đại
Bộ 2 Thanh RAM PC G.Skill 32GB (16GBx2) Ripjaws Tản Nhiệt DDR4 F4-3000C16D-32GVRB không chỉ được thiết kế với kiểu dáng mới, mà còn còn sở hữu gam màu đỏ rực rỡ, Ripjaws chắc chắn là một lựa chọn tuyệt vời. Đặc biệt, thiết bị được thiết kế với chiều cao mô-đun 42mm phù hợp với hầu hết các tản nhiệt CPU quá khổ.",
 avatarUrl:"https://salt.tikicdn.com/cache/w444/ts/product/06/52/27/00294e84ad558ed3dd67a7bd49230bd5.jpg"    
});

create (p:Product 
{proId:"60b4e78e9fee800540447319",
 proName:"Bộ 2 Thanh RAM",
 price:3000000,
 fullDes:"Tốc độ 3000MHz
Độ trễ CL16-18-18-38
RAM chuẩn: DDR4
Dung lượng: 32GB (16GBx2)
Thiết kế nhỏ gọn, hiện đại
Bộ 2 Thanh RAM PC G.Skill 32GB (16GBx2) Ripjaws Tản Nhiệt DDR4 F4-3000C16D-32GVRB không chỉ được thiết kế với kiểu dáng mới, mà còn còn sở hữu gam màu đỏ rực rỡ, Ripjaws chắc chắn là một lựa chọn tuyệt vời. Đặc biệt, thiết bị được thiết kế với chiều cao mô-đun 42mm phù hợp với hầu hết các tản nhiệt CPU quá khổ.",
 avatarUrl:"https://salt.tikicdn.com/cache/w444/ts/product/06/52/27/00294e84ad558ed3dd67a7bd49230bd5.jpg"    
});

// create category

create (cat:Category {catId:1, catName:"Nhà cửa, đời sống"});
create (cat:Category {catId:2, catName:"Thể thao, dã ngoại"});
create (cat:Category {catId:3, catName:"Laptop, vi tính, linh kiện"});


// create relationship product belong to category

match
(p:Product),
(cat:Category)
where p.proId="60b4e68c9fee800540447315"
    and cat.catId=1
create (p)-[r:BELONG_TO]->(cat);


match
(p:Product),
(cat:Category)
where p.proId="60b4e7169fee800540447316"
    and cat.catId=2
create (p)-[r:BELONG_TO]->(cat);

match
(p:Product),
(cat:Category)
where p.proId="60b4e7799fee800540447317"
    and cat.catId=3
create (p)-[r:BELONG_TO]->(cat);


match
(p:Product),
(cat:Category)
where p.proId="60b4e7849fee800540447318"
    and cat.catId=3
create (p)-[r:BELONG_TO]->(cat);

match
(p:Product),
(cat:Category)
where p.proId="60b4e78e9fee800540447319"
    and cat.catId=3
create (p)-[r:BELONG_TO]->(cat);

 *
 */

module.exports = router;
