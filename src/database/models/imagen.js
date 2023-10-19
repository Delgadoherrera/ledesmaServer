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
  };
  let config = {
    tableName: "imagen",
    timestamps: false,
  };
  const Imagen = sequelize.define(alias, cols, config);

  Imagen.associate = function (models) {
    Imagen.hasMany(models.Catalogo_producto, {
      as: "catalogo_productos", // Alias para la relación
      foreignKey: "id", // La columna correcta que relaciona unidades de medida con materiales
    });
  };
  return Imagen;  
};
