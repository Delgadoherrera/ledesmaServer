const express = require("express");
const router = express.Router();
const db = require("../database/models");
const Catalogo_materiales = db.Catalogo_material;
const Compra_materiales = db.Compra_material;
const Cotizacion = db.Cotizacion;
const Catalogo_unidad_medida = db.Catalogo_unidad_medida;
const Combo_materiales = db.Combo_material;
const Combo_material_items = db.Combo_material_item;

var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const objetoFecha = Date.now();
const nowDate = new Date(objetoFecha);
const fecha = nowDate.toLocaleDateString("en-ZA");

router.post("/materiales/nuevoMaterial", async (req, res) => {
  console.log("req.body", req.body);

  try {
    let unidadMedidaExistente = await Catalogo_unidad_medida.findOne({
      where: {
        unidadMedida: req.body.unidadMedida,
      },
    });

    if (!unidadMedidaExistente) {
      unidadMedidaExistente = await Catalogo_unidad_medida.create({
        unidadMedida: req.body.unidadMedida,
      });
    }

    const { descripcion, medida, unidadMedida } = req.body;

    const nuevoMaterial = await db.Catalogo_material.create({
      descripcion,
      medida,
      estado: "activo",
      unidadMedidaId: unidadMedidaExistente.id,
      Catalogo_unidad_medidaId: unidadMedidaExistente, // Asocia el material con la unidad de medida existente
    });
    res
      .status(201)
      .json({ message: "Material creado con éxito", material: nuevoMaterial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al crear el material" });
  }
});
module.exports = router;
//MATERIALES

router.get("/materiales/listarTodos", (req, res) => {
  console.log("Listando productos con unidades de medida");

  Catalogo_materiales.findAll({
    where: {
      estado: "activo",
    },
    include: [
      {
        model: Catalogo_unidad_medida,
        as: "unidadMedida",
      },
    ],
  })
    .then(function (materiales) {
      return res.status(200).json(materiales);
    })
    .catch((error) => {
      console.log("Error: " + error);
      return res.status(500).send("Error al listar materiales");
    });
});

router.post("/materiales/borrarMaterial/:id", (req, res) => {
  Catalogo_materiales.update(
    {
      estado: "hide",
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );

  res.status(200).send("success");
});
router.put("/materiales/editar/:id", async (req, res) => {
  console.log("req.body", req.body);
  const materialId = req.params.id;
  const { unidadMedida } = req.body.data;

  try {
    let unidadMedidaExistente = await Catalogo_unidad_medida.findOne({
      where: {
        unidadMedida: unidadMedida,
      },
    });

    if (!unidadMedidaExistente) {
      unidadMedidaExistente = await Catalogo_unidad_medida.create({
        unidadMedida: unidadMedida,
      });
    }
    console.log("unidadMedidaExistente ID", unidadMedidaExistente);
    const material = await db.Catalogo_material.findByPk(materialId);

    if (!material) {
      return res.status(404).json({ error: "Material no encontrado" });
    }

    material.unidadMedidaId = unidadMedidaExistente.id;
    await material.save();

    res.status(200).json({ message: "Unidad de medida actualizada con éxito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Hubo un error al actualizar la unidad de medida" });
  }
});

router.post("/materiales/comprar/:id", async (req, res) => {
  console.log("comprando:", req.body);
  try {
    const dir = req.body.data;

    const unidadMedida = req.body.unidadMedida;
    const medida = req.body.medida;

    const nuevaCompra = await Compra_materiales.create({
      idMaterial: req.params.id,
      fechaCompra: fecha,
      precioPesos: dir.precioPesos,
      conversion: dir.conversion,
      medidaId: dir.medidaId,
      unidades: dir.unidades,
    });

    const compraId = nuevaCompra.idCompra;

    const nuevaCotizacion = await Cotizacion.create({
      fechaCotizacion: fecha,
      conversion: dir.conversion,
      compraId: compraId,
    });

    res.status(200).send("Compra y cotización creadas con éxito");
  } catch (error) {
    console.error("Error al realizar la compra y cotización:", error);
    res.status(500).send("Error al realizar la compra y cotización");
  }
});

router.get("/compras/listarTodas", (req, res) => {
  Compra_materiales.findAll({
    include: [
      {
        model: Catalogo_materiales,
        as: "catalogo_material",
      },
      {
        model: Cotizacion,
        as: "cotizacion",
      },
      {
        model: Catalogo_unidad_medida,
        as: "unidadMedida",
      },
    ],
  })
    .then(function (compras) {
      console.log("COMPRAS con INCLUDE", compras);
      return res.status(200).send(compras);
    })
    .catch((error) => {
      console.log("Error al listar compras: " + error);
      return res.status(500).send("Error al listar compras");
    });
});

//COMBOS

router.post("/combos/nuevoCombo", async (req, res) => {
  console.log("req.body", req.body);

  try {
    // Crear el combo en la base de datos
    const nuevoCombo = await db.Combo_material.create({
      nombreCombo: "primerCombo" || req.body.nombreCombo, // Obtén el nombre del combo desde req.body
      estado: "activo", // O establece el estado de acuerdo a tus necesidades
    });

    await db.Combo_material_item.create({
      combo_material_id: nuevoCombo.id, // Asociar el elemento con el nuevo combo
      material_id: id, // Suponemos que elemento.material_id es el ID del material de Catalogo_material
    });

    // Agregar elementos de combo a través de req.body
    const elementosCombo = req.body.elementosCombo; // Supongamos que elementosCombo es un arreglo de elementos

    // Iterar a través de los elementosCombo y crear las asociaciones con Combo_material_item
    /*     for (const elemento of elementosCombo) {
      await db.Combo_material_item.create({
        combo_material_id: nuevoCombo.id, // Asociar el elemento con el nuevo combo
        material_id: elemento.material_id, // Suponemos que elemento.material_id es el ID del material de Catalogo_material
      });
    } */

    res
      .status(201)
      .json({ message: "Combo creado con éxito", combo: nuevoCombo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al crear el combo" });
  }
});

module.exports = router;
