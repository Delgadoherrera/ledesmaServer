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
    categoriaId: {
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
    Catalogo_producto.belongsTo(models.Categoria_producto_item, {
      foreignKey: "categoriaId",
      as: "producto",
    });
    Catalogo_producto.associate = function (models) {
      Catalogo_producto.hasMany(models.Imagen, {
        foreignKey: 'catalogoId', // La columna en la tabla Imagen que se relaciona con el catálogo
        as: 'imagenes', // Un alias para la relación, puedes cambiar esto si lo deseas
      });
    };
  };

  return Catalogo_producto;
};
