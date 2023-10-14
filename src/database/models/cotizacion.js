module.exports = (sequelize, dataTypes) => {
  let alias = "Cotizacion";
  let cols = {
    idCotizacion: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fechaCotizacion: {
      type: dataTypes.DATE,
    },
    conversion: {
      type: dataTypes.DECIMAL(8, 2), // Especificación de precisión y escala
    },
    compraId: { // Cambié "idCotizacion" por "compraId" para ser una referencia a la tabla de compras
      type: dataTypes.INTEGER,
    },
  };
  let config = {
    tableName: "cotizacion",
    timestamps: false,
  };
  const Cotizacion = sequelize.define(alias, cols, config);

  Cotizacion.associate = function (models) {
    Cotizacion.belongsTo(models.Compra_material, {
      as: "compra_material",
      foreignKey: "idCompra",
    });
  };

  return Cotizacion;
};
