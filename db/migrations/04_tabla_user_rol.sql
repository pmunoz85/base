///////////////////////////////////////
//  ESTRUCTURA DE LA BASES DE DATOS  //
///////////////////////////////////////

// MySql

drop table user_rol;

create table user_rol (
  id INT not null AUTO_INCREMENT, 
  user_id INT NOT NULL,
  rol_id INT NOT NULL,
  createdAt DATETIME, 
  updatedAt DATETIME, 
  primary key (id) 
  FOREIGN KEY (user_id) REFERENCES usuarios(id)
);


// PostgreSql

drop table user_rol;

create table user_rol (
  id SERIAL, 
  user_id INT NOT NULL,
  rol VARCHAR(64) NOT NULL, 
  created_at timestamp, 
  updated_at timestamp, 
  primary key (id), 
  constraint no_duplicar_usuario_rol unique (user_id, rol),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

alter table user_rol add constraint no_duplicar_usuario_rol unique (user_id, rol);
