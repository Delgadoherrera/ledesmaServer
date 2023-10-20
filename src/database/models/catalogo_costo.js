module.exports = (sequelize, dataTypes) => {
  let alias = "Catalogo_costo";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idCostoItem: {
      type: dataTypes.INTEGER,
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

  return Catalogo_costo;
};
