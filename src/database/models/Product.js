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
    nombre: {
      type: dataTypes.STRING,
    },
    descripcion: {
      type: dataTypes.STRING,
    },
    status: {
      type: dataTypes.STRING,
    },
    largo: {
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
    tableName: "productos",
    timestamps: false,
  };
  const Producto = sequelize.define(alias, cols, config);

  return Producto;
};
