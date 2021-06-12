const router = require('express').Router();
const productModel = require('../models/product.model');
const neo4jDriver = require('neo4j-driver');
const neo4jConfig = require('../config/neo4j.config');

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

// product detail neo4j
router.get('/:id', async function (req, res) {
  const id = +req.params.id;

  // neo4jConfig.getPersonName((er, data) => {
  //   console.log(data);
  //   const products = data;

  //   res.render('vwProductDetail/vwProductDetail.hbs', {
  //     layout: 'layout',
  //     products
  //   });
  // });

  res.render('vwProductDetail/vwProductDetail.hbs', {
    layout: 'layout',
    // products,
    relativePro: [1, 2, 3]
  });
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
 avatarUrl:"https://salt.tikicdn.com/cache/w444/ts/product/45/79/a5/c76398ae87578ca5d9ad9ab609bae49a.jpg"    
});


create (p:Product 
{proId:"60b4e7169fee800540447316",
 proName:"Dụng cụ vặn ván trượt Patin chữ T kèm khóa Allen",
 price:33000,
 avatarUrl:"https://salt.tikicdn.com/cache/w444/ts/product/3f/e7/53/cc32b8f9b91e62173fd15bb0a1101da6.jpg"    
});


create (p:Product 
{proId:"60b4e7799fee800540447317",
 proName:"Bộ 2 Thanh RAM PC G.Skill 32GB (16GBx2) LED RGB Tản Nhiệt DDR4 F4-3000C16D-32GTZR - Hàng Chính Hãng",
 price:5346800,
 avatarUrl:"https://salt.tikicdn.com/cache/w444/ts/product/3f/e7/53/cc32b8f9b91e62173fd15bb0a1101da6.jpg"    
});



create (p:Product 
{proId:"60b4e7849fee800540447318",
 proName:"Bộ 2 Thanh RAM PC G.Skill 32GB (16GBx2) LED RGB Tản Nhiệt DDR4 F4-3000C16D-32GTZR - Hàng Chính Hãng",
 price:5346800,
 avatarUrl:"https://salt.tikicdn.com/cache/w444/ts/product/3f/e7/53/cc32b8f9b91e62173fd15bb0a1101da6.jpg"    
});



create (p:Product 
{proId:"60b4e78e9fee800540447319",
 proName:"Bộ 2 Thanh RAM",
 price:3000000,
 avatarUrl:"https://salt.tikicdn.com/cache/w444/ts/product/3f/e7/53/cc32b8f9b91e62173fd15bb0a1101da6.jpg"    
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
