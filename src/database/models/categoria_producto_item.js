module.exports = (sequelize, dataTypes) => {
  let alias = "Categoria_producto_item";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: dataTypes.STRING,
    },
  };
  let config = {
    tableName: "categoria_producto_item",
    timestamps: false,
  };
  const Categoria_producto_item = sequelize.define(alias, cols, config);

  Categoria_producto_item.associate = function (models) {
    Categoria_producto_item.hasMany(models.Catalogo_producto, {
      as: "catalogo_producto", // Alias para la relación
      foreignKey: "id", // La columna correcta que relaciona unidades de medida con materiales
    });
  };
  return Categoria_producto_item;  
};
