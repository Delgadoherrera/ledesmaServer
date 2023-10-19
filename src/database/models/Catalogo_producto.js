module.exports = (sequelize, dataTypes) => {
  let alias = "Catalogo_producto";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: dataTypes.TEXT, // Cambié a TEXT
    },
    medida: {
      type: dataTypes.STRING,
    },
    estado: {
      type: dataTypes.STRING,
    },
    nombre: {
      type: dataTypes.STRING,
    },
    unidadMedidaId: {
      type: dataTypes.INTEGER,
    },
    imagenId: {
      type: dataTypes.INTEGER,
    },
  };

  let config = {
    tableName: "catalogo_producto",
    timestamps: false,
  };
  const Catalogo_producto = sequelize.define(alias, cols, config);
  Catalogo_producto.associate = function (models) {
    Catalogo_producto.belongsTo(models.Catalogo_unidad_medida, {
      foreignKey: "unidadMedidaId",
      as: "unidadMedida",
    });
    Catalogo_producto.belongsTo(models.Imagen, {
      foreignKey: "imagenId",
      as: "blobImage",
    });
  };
  return Catalogo_producto;
};
