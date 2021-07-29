///////////////////////////////////////
//  ESTRUCTURA DE LA BASES DE DATOS  //
///////////////////////////////////////

// MySql

drop table secundarios;

create table secundarios (
  id INT NOT NULL AUTO_INCREMENT, 
  principal_id INT NOT NULL,
  descripcion TEXT, 
  solucion  BOOLEAN, 
  created_at DATETIME, 
  updated_at DATETIME, 
  PRIMARY KEY (id),
  FOREIGN KEY (principal_id) REFERENCES principales(id)
  );

// PostgreSql

drop table secundarios;

create table secundarios (
  id SERIAL, 
  principal_id INT NOT NULL,
  descripcion TEXT, 
  solucion  BOOLEAN, 
  created_at timestamp, 
  updated_at timestamp, 
  PRIMARY KEY (id),
  FOREIGN KEY (principal_id) REFERENCES principales(id)
  );

