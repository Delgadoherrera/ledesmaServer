module.exports = (sequelize, dataTypes) => {
  let alias = "Catalogo_material";
  let cols = {
    idCompra: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idMaterial: {
      type: dataTypes.INTEGER,
    },
    fechaCompra: {
      type: dataTypes.DATE,
    },
    precio: {
      type: dataTypes.DECIMAL,
    },
  };

  let config = {
    tableName: "catalogo_material",
    timestamps: false,
  };
  const Catalogo_material = sequelize.define(alias, cols, config);

  return Catalogo_material;
};
