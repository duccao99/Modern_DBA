drop database if exists `modern_dba`;
create database `modern_dba`;
use `modern_dba`;
-- ------------------------------------
-- Table structure for `category`
-- ------------------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`(
	catId int auto_increment,
    catName nvarchar(200),
    primary key (catId)
);

-- ------------------------------------
-- Records for  `category`
-- ------------------------------------
insert into `category`(catName) values ('Nhà cửa, đời sống');
insert into `category`(catName) values ('Thể thao, dã ngoại');
insert into `category`(catName) values ('Laptop, vi tính, linh kiện');
-- ------------------------------------
-- Table structure for `product`
-- ------------------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product`(
	proId nvarchar(200),
	proName nvarchar(200),
	avatarUrl nvarchar(200),
	price int(10),
    catId int,
    
    primary key (proId),
    foreign key (catId) references `category`(catId)
);

-- ------------------------------------
-- Records for  `product`
-- ------------------------------------
insert into `product`(proId,proName,avatarUrl,price,catId) values ('60b4e68c9fee800540447315','100 cây Keo Nến ( Keo Nhiệt ) dài 24cm dùng cho súng bắn keo 20w','https://salt.tikicdn.com/cache/w444/ts/product/45/79/a5/c76398ae87578ca5d9ad9ab609bae49a.jpg',95000,1);
insert into `product`(proId,proName,avatarUrl,price,catId) values ('60b4e7169fee800540447316','Dụng cụ vặn ván trượt Patin chữ T kèm khóa Allen','https://salt.tikicdn.com/cache/w444/ts/product/3f/e7/53/cc32b8f9b91e62173fd15bb0a1101da6.jpg',33000,2);
insert into `product`(proId,proName,avatarUrl,price,catId) values ('60b4e7799fee800540447317','Bộ 2 Thanh RAM PC G.Skill 32GB (16GBx2) LED RGB Tản Nhiệt DDR4 F4-3000C16D-32GTZR - Hàng Chính Hãng','https://salt.tikicdn.com/cache/w444/ts/product/3f/e7/53/cc32b8f9b91e62173fd15bb0a1101da6.jpg',5346800,3);
insert into `product`(proId,proName,avatarUrl,price,catId) values ('60b4e7849fee800540447318','Bộ 2 Thanh RAM PC G.Skill 32GB (16GBx2) LED RGB Tản Nhiệt DDR4 F4-3000C16D-32GTZR - Hàng Chính Hãng','https://salt.tikicdn.com/cache/w444/ts/product/06/52/27/00294e84ad558ed3dd67a7bd49230bd5.jpg',5346800,3);
insert into `product`(proId,proName,avatarUrl,price,catId) values ('60b4e78e9fee800540447319','Bộ 2 Thanh RAM','https://salt.tikicdn.com/cache/w444/ts/product/06/52/27/00294e84ad558ed3dd67a7bd49230bd5.jpg',3000000,3);



-- ------------------------------------
-- Table structure for `cart`
-- ------------------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart`(
	cartId int auto_increment,
	proId nvarchar(200),
    userId int default 6,
    
    primary key (cartId,proId),
    foreign key (proId) references `product`(proId)
);
-- ------------------------------------
-- Records for  `cart`
-- ------------------------------------
insert into `cart`(cartId,proId) values (3,'60b4e68c9fee800540447315');




