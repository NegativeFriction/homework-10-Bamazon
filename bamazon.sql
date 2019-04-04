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
values("Chewing Gum",3.50,50,"Wrigley's"),("Blue Jeans",50.99,100,"Levi's"),("Warheads Candies",0.50,1000,"Mars Candies"),("Northwestern Coding Bootcamp",10000.00,25,"Poornima"),("A sense of Pride and Accomplishment",60.00,10000,"EA Games"),("Dank Memes",0.25,100000,"4 Chan"),("A shrinkwrapped copy of Windows 95",25.53, 1, "Bill Gates"),("An Apple iPod",10000,1111111,"Apple"),("Red Solo Cups",0.25,100,"Toby Keith"),("Ska Music",9.99,1000,"The Mighty Mighty Boss Tones");
select * from products
