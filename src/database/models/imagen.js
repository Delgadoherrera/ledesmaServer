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
    catalogoId: {
      type: dataTypes.INTEGER,
    },
  };
  let config = {
    tableName: "imagen",
    timestamps: false,
  };
  const Imagen = sequelize.define(alias, cols, config);

  Imagen.associate = function (models) {
    Imagen.associate = function (models) {
      Imagen.belongsTo(models.Catalogo_producto, {
        foreignKey: "catalogoId", // La columna en la tabla Imagen que se relaciona con el catálogo
        as: "catalogo_producto", // Un alias para la relación, puedes cambiar esto si lo deseas
      });
    };
  };
  return Imagen;
};
