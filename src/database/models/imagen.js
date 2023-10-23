module.exports = (sequelize, dataTypes) => {
  let alias = "Imagen";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    blobImage: {
      type: dataTypes.STRING,
    },
    categoriaId: {
      type: dataTypes.INTEGER,
    },
  };
  let config = {
    tableName: "imagen",
    timestamps: false,
  };
  const Imagen = sequelize.define(alias, cols, config);

  Imagen.associate = function (models) {
    /*    Imagen.hasMany(models.Catalogo_producto, {
      as: "catalogo_productos", // Alias para la relación
      foreignKey: "imagenId", // La columna correcta que relaciona unidades de medida con materiales
    }); */

    Imagen.belongsTo(models.Catalogo_producto, {
      foreignKey: "imagenId",
      as: "blobImage",
    });
  };
  return Imagen;
};
