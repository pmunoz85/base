module.exports = (sequelize, Sequelize) => {
  const Principales = sequelize.define(
    'principales',
    {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
        required: true,
        primaryKey: true,
      },
      descripcion: {
        type: Sequelize.DataTypes.TEXT,
        required: true,
      },
    },
    { underscored: true, tableName: 'principales' }
  );

  return Principales;
};
