module.exports = (sequelize, dataTypes) => {
  let alias = "Venta_producto";
  let cols = {
    idVenta: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idProducto: {
      type: dataTypes.INTEGER,
    },
    fechaVenta: {
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
    tableName: "venta_producto",
    timestamps: false,
  };

  const Venta_producto = sequelize.define(alias, cols, config);

  Venta_producto.associate = function (models) {
    Venta_producto.belongsTo(models.Catalogo_material, {
      as: "catalogo_material",
      foreignKey: "idMaterial",
    });

    Venta_producto.belongsTo(models.Catalogo_unidad_medida, {
      as: "unidadMedida",
      foreignKey: "medidaId",
    });

    Venta_producto.hasOne(models.Cotizacion, {
      as: "cotizacion",
      foreignKey: "compraId",
    });
  };

  return Compra_material;
};
