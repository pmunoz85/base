module.exports = (sequelize, Sequelize) => {
  const UserRol = sequelize.define(
    'user_rol',
    {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
        required: true,
        primaryKey: true,
      },
      user_id: Sequelize.DataTypes.INTEGER,
      rol: Sequelize.DataTypes.STRING(64),
    },
    { underscored: true, tableName: 'user_rol' }
  );

  return UserRol;
};
