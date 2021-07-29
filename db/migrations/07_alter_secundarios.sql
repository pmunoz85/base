///////////////////////////////////////
//  ESTRUCTURA DE LA BASES DE DATOS  //
///////////////////////////////////////

// MySql

Down
alter table secundarios drop file_path;

Up
alter table secundarios add file_path VARCHAR(1024);


// PostgreSql

Down
alter table secundarios drop file_path;

Up
alter table secundarios add file_path VARCHAR(1024);

