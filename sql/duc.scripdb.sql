use `modern_dba`;

-- 1. xem danh sach san pham 
select * 
from `product`;

-- 2. xem gio hang
select *
from `cart`;

-- 3. them san pham vao gio hang
insert into `cart`(cartId,proId) values (3,'60b4e68c9fee800540447315');

-- 4. Xem chi tiet san pham
-- chi tiet san pham
select p.proId, p.proName, p.avatarUrl, p.price ,
c.catId, c.catName
from `product` p
left join `category` c 
on c.catId = p.catId;
-- relative product
select * 
from `product` p 
where p.proId != 'proId' 
and p.catId = 'catId'
limit 4;





select * from `category`;
select * from `product`;
select * from `cart`;