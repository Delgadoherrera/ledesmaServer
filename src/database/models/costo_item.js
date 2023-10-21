module.exports = (sequelize, dataTypes) => {
  let alias = "Costo_item";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    valor: {
      type: dataTypes.INTEGER,
    },
    fecha: {
      type: dataTypes.DATE,
    },
    detalle: {
      type: dataTypes.STRING,
    },
    idCosto: {
      type: dataTypes.INTEGER,
    },
    
  };
  let config = {
    tableName: "costo_item",
    timestamps: false,
  };
  const Costo_item = sequelize.define(alias, cols, config);

  Costo_item.associate = function (models) {
    Costo_item.belongsTo(models.Catalogo_costo, {
      as: "catalogo_costo", // Alias para la relación
      foreignKey: "idCosto", // La columna correcta que relaciona unidades de medida con materiales
    });
  };
  return Costo_item;
};
