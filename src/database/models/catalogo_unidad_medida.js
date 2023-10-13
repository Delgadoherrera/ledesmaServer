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


  Catalogo_unidad_medida.associate = function (models) {
    Catalogo_unidad_medida.belongsTo(models.catalogo_material, {
      as: "catalogo_material",
      foreignKey: "id",
    });
  };
  return Catalogo_unidad_medida;  
};
