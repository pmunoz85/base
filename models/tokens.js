module.exports = (sequelize, Sequelize) => {
  const Tokens = sequelize.define(
    'tokens',
    {
      revocado: Sequelize.DataTypes.STRING(1024),
    },
    { underscored: true, tableName: 'tokens' }
  );

  return Tokens;
};
