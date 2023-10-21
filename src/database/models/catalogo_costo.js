module.exports = (sequelize, dataTypes) => {
  let alias = "Catalogo_costo";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    costo: {
      type: dataTypes.STRING,
    },
    concepto: {
      type: dataTypes.STRING,
    },
  };
  let config = {
    tableName: "catalogo_costo",
    timestamps: false,
  };
  const Catalogo_costo = sequelize.define(alias, cols, config);
  Catalogo_costo.associate = function (models) {
    Catalogo_costo.belongsTo(models.Costo_item, {
      foreignKey: "id", // Utiliza el campo correcto para la relación
      as: "idCosto", // Usa el alias correcto
    });
  };
  return Catalogo_costo;
};
