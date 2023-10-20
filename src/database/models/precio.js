module.exports = (sequelize, dataTypes) => {
  let alias = "Precio";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    precioPesos: {
      type: dataTypes.INTEGER,
    },
    precioDolar: {
      type: dataTypes.INTEGER,
    },
  };
  let config = {
    tableName: "precio",
    timestamps: false,
  };
  const Precio = sequelize.define(alias, cols, config);

  Precio.associate = function (models) {
    Precio.hasMany(models.Catalogo_producto, {
      as: "catalogo_producto", // Alias para la relación
      foreignKey: "id", // La columna correcta que relaciona unidades de medida con materiales
    });
  };
  return Precio;
};
