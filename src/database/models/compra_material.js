module.exports = (sequelize, dataTypes) => {
  let alias = "Compra_material";
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
    precioPesos: {
      type: dataTypes.DECIMAL,
    },
    medida: {
      type: dataTypes.STRING,
    },
  };

  let config = {
    tableName: "compra_material",
    timestamps: false,
  };

  const Compra_material = sequelize.define(alias, cols, config);

  Compra_material.associate = function (models) {
    Compra_material.belongsTo(models.Catalogo_material, {
      as: "catalogo_material",
      foreignKey: "idMaterial",
    });
  };

  return Compra_material;
};
