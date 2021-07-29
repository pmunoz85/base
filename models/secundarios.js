module.exports = (sequelize, Sequelize) => {
  const Actuaciones = sequelize.define(
    'actuaciones',
    {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
        required: true,
        primaryKey: true,
      },
      incidencia_id: Sequelize.DataTypes.INTEGER,
      descripcion: {
        type: Sequelize.DataTypes.TEXT,
        required: true,
      },
      solucion: Sequelize.DataTypes.BOOLEAN,
      file_path: Sequelize.DataTypes.STRING(1024),
    },
    { underscored: true, tableName: 'actuaciones' }
  );

  return Actuaciones;
};
