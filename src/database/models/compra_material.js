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
      type: dataTypes.DECIMAL(8, 2), // Especificación de precisión y escala
    },
    medidaId: {
      // Cambié "medida" por "medidaId" para ser una referencia a la tabla de unidades de medida
      type: dataTypes.INTEGER,
    },
    unidades: {
      type: dataTypes.INTEGER,
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

    Compra_material.belongsTo(models.Catalogo_unidad_medida, {
      as: "unidadMedida",
      foreignKey: "medidaId",
    });

    Compra_material.hasOne(models.Cotizacion, {
      as: "cotizacion",
      foreignKey: "compraId",
    });
  };

  return Compra_material;
};
