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
    categoria_id: {
      type: dataTypes.INTEGER,
    },
  };
  let config = {
    tableName: "categoria_producto_item",
    timestamps: false,
  };
  const Categoria_producto_item = sequelize.define(alias, cols, config);

  Categoria_producto_item.associate = function (models) {
    Categoria_producto_item.belongsTo(models.Catalogo_categoria_producto, {
      as: "categoria", // Alias para la relación
      foreignKey: "categoria_id", // La columna correcta que relaciona elementos con categorías
    });
  };
  return Categoria_producto_item;
};
