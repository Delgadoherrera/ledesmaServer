module.exports = (sequelize, dataTypes) => {
  let alias = "Catalogo_unidad_medida";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    unidadMedida: {
      type: dataTypes.STRING,
    },
  };
  let config = {
    tableName: "catalogo_unidad_medida",
    timestamps: false,
  };
  const Catalogo_unidad_medida = sequelize.define(alias, cols, config);

  return Catalogo_unidad_medida;
};
