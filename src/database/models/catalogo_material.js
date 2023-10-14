module.exports = (sequelize, dataTypes) => {
  let alias = "Catalogo_material";
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
  };

  let config = {
    tableName: "catalogo_material",
    timestamps: false,
  };
  const Catalogo_material = sequelize.define(alias, cols, config);
  Catalogo_material.associate = function (models) {
    Catalogo_material.belongsTo(models.Catalogo_unidad_medida, {
      foreignKey: "id", // Utiliza el campo correcto para la relación
      as: "unidadMedida", // Usa el alias correcto
    });
  };
  return Catalogo_material;
};
