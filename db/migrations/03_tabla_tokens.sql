///////////////////////////////////////
//  ESTRUCTURA DE LA BASES DE DATOS  //
///////////////////////////////////////

// MySql

drop table tokens;

create table tokens (
  id INT not null AUTO_INCREMENT, 
  revocado VARCHAR(1024) NOT NULL UNIQUE, 
  createdAt DATETIME, 
  updatedAt DATETIME, 
  primary key (id) );


// PostgreSql

drop table tokens;

create table tokens (
  id SERIAL, 
  revocado VARCHAR(1024) NOT NULL UNIQUE, 
  created_at timestamp, 
  updated_at timestamp, 
  primary key (id) );

