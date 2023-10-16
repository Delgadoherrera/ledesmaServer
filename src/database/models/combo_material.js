module.exports = (sequelize, dataTypes) => {
  let alias = "Combo_material";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreCombo: {
      type: dataTypes.TEXT,
    },
    estado: {
      type: dataTypes.STRING,
    },
  };

  let config = {
    tableName: "combo_material",
    timestamps: false,
  };
  
  const Combo_material = sequelize.define(alias, cols, config);

  Combo_material.associate = function (models) {
    Combo_material.hasMany(models.Combo_material_item, {
      as: "combo_material_items", // Un nombre más apropiado para la relación
      foreignKey: "combo_material_id",
    });
  };

  return Combo_material;
};
