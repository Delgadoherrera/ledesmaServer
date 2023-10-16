module.exports = (sequelize, dataTypes) => {
  let alias = "Combo_material_item";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    combo_material_id: {
      type: dataTypes.INTEGER,
    },
    material_id: {
      type: dataTypes.INTEGER,
    },
  };

  let config = {
    tableName: "combo_material_item",
    timestamps: false,
  };

  const Combo_material_item = sequelize.define(alias, cols, config);

  Combo_material_item.associate = function (models) {
    Combo_material_item.belongsTo(models.Catalogo_material, {
      as: "catalogo_material", // Un nombre más apropiado para la relación
      foreignKey: "material_id",
    });

    Combo_material_item.belongsTo(models.Combo_material, {
      as: "combo_material", // Un nombre más apropiado para la relación
      foreignKey: "combo_material_id",
    });
  };

  return Combo_material_item;
};
