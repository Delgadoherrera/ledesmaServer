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
  Catalogo_material.belongsTo(models.Catalogo_unidad_medida, {
    as: "catalogo_unidad_medida",
    foreignKey: "unidadMedida", // Cambia "id" a "unidadMedida"
  });
  return Catalogo_material;
};
