module.exports = (sequelize, dataTypes) => {
  let alias = "Producto";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: dataTypes.INTEGER,
    },
    descripcion: {
      type: dataTypes.STRING,
    },
    articulo: {
      type: dataTypes.STRING,
    },
    largo: {
      type: dataTypes.STRING,
    },
    peso: {
      type: dataTypes.INT,
    },
    alto: {
      type: dataTypes.STRING,
    },
    ancho: {
      type: dataTypes.STRING,
    },
    unidadMedida: {
      type: dataTypes.STRING,
    },
    cantidad: {
      type: dataTypes.INTEGER,
    },
  };
  let config = {
    tableName: "Products",
    timestamps: false,
  };
  const Producto = sequelize.define(alias, cols, config);

  return Producto;
};
