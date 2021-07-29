module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'users',
    {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
        required: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        required: true,
      },
      encrypted_password: Sequelize.STRING,
    },
    { underscored: true, tableName: 'users' }
  );

  // createdAt: Sequelize.DATE,
  // updatedAt: Sequelize.DATE,

  return User;
};
