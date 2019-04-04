drop database if exists bamazon;
create database bamazon;
use bamazon;

create table products(
id int not null auto_increment,
primary key (id),
productName varchar(50),
productPrice decimal(10,2),
productQuantity int(5),
productSeller varchar(50)
);

insert into products(productName,productPrice,productQuantity,productSeller)
values("Chewing Gum",3.50,50,"Wrigley's"),("Blue Jeans",50.99,100,"Levi's"),("Warheads Candies",0.50,1000,"Mars Candies"),("Northwestern Coding Bootcamp",10000.00,25,"Poornima");
select * from products
