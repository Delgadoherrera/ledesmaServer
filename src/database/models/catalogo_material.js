module.exports = (sequelize, dataTypes) => {
  let alias = "Catalogo_material";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: dataTypes.STRING,
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
  Catalogo_material.hasOne(Catalogo_unidad_medida, {
    foreignKey: "unidadMedida", // Nombre de la columna que relaciona los modelos
    as: "unidadMedida", // Alias para la relación
  });

  return Catalogo_material;
};
