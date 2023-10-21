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
    estado: {
      type: dataTypes.STRING,
    },
  };
  let config = {
    tableName: "catalogo_costo",
    timestamps: false,
  };
  const Catalogo_costo = sequelize.define(alias, cols, config);
  Catalogo_costo.associate = function (models) {
    Catalogo_costo.hasMany(models.Costo_item, {
      foreignKey: "idCosto", // Utiliza el campo correcto para la relación
      as: "catalogo_costo", // Usa el alias correcto
    });
  };
  return Catalogo_costo;
};
