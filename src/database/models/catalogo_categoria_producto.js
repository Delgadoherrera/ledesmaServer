module.exports = (sequelize, dataTypes) => {
  let alias = "Catalogo_categoria_producto";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    detalle: {
      type: dataTypes.STRING,
    },
  };
  let config = {
    tableName: "catalogo_categoria_producto",
    timestamps: false,
  };
  const Catalogo_categoria_producto = sequelize.define(alias, cols, config);

  Catalogo_categoria_producto.associate = function (models) {
    Catalogo_categoria_producto.hasMany(models.Catalogo_producto, {
      as: "catalogo_producto", // Alias para la relación
      foreignKey: "id", // La columna correcta que relaciona unidades de medida con materiales
    });
  };
  return Catalogo_categoria_producto;  
};
