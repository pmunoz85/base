///////////////////////////////////////
//  ESTRUCTURA DE LA BASES DE DATOS  //
///////////////////////////////////////

// MySql

drop table users;

create table users (
  id INT not null AUTO_INCREMENT, 
  email VARCHAR(256) NOT NULL UNIQUE, 
  encrypted_password VARCHAR(1024) NOT NULL, 
  createdAt DATETIME, 
  updatedAt DATETIME, 
  primary key (id) );


// PostgreSql

drop table users;

create table users (
  id SERIAL, 
  email VARCHAR(256) NOT NULL UNIQUE, 
  encrypted_password VARCHAR(1024) NOT NULL, 
  created_at timestamp, 
  updated_at timestamp, 
  primary key (id) );

