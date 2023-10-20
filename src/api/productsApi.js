const express = require("express");
const router = express.Router();
const db = require("../database/models");
const Catalogo_materiales = db.Catalogo_material;
const Compra_materiales = db.Compra_material;
const Cotizacion = db.Cotizacion;
const Catalogo_unidad_medida = db.Catalogo_unidad_medida;
const Combo_materiales = db.Combo_material;
const Combo_material_items = db.Combo_material_item;
const Venta_productos = db.Venta_producto;
const Imagenes = db.Imagen;
const Catalogo_productos = db.Catalogo_producto;
const Catalogo_costos = db.Catalogo_costo;
const Costo_items = db.Costo_item;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const objetoFecha = Date.now();
const nowDate = new Date(objetoFecha);
const fecha = nowDate.toLocaleDateString("en-ZA");

router.post("/productos/nuevoProducto", async (req, res) => {
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

    const imagen = await db.Imagen.create({
      blobImage: req.body.img,
    });

    const { descripcion, medida, unidadMedida, img, nombre } = req.body;

    const nuevoProducto = await db.Catalogo_producto.create({
      descripcion,
      medida,
      nombre: nombre,
      estado: "activo",
      imagenId: imagen.id,
      unidadMedidaId: unidadMedidaExistente.id,
      Catalogo_unidad_medidaId: unidadMedidaExistente, // Asocia el material con la unidad de medida existente
    });
    res.status(201).json({
      message: "nuevo producto creado con éxito",
      material: nuevoProducto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al crear el nuevo Producto" });
  }
});

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
router.post("/costos/nuevoCosto", async (req, res) => {
  console.log("req.body", req.body);
  try {
    const { costo, concepto } = req.body;
    const nuevoCosto = await Catalogo_costos.create({
      costo: costo,
      concepto: concepto,
    });
    res
      .status(201)
      .json({ message: "Costo creado con éxito", material: nuevoCosto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al crear el material" });
  }
});

router.get("/costos/listarTodos", (req, res) => {
  console.log("Listando costos");

  Catalogo_costos.findAll()
    .then(function (costos) {
      return res.status(200).json(costos);
    })
    .catch((error) => {
      console.log("Error: " + error);
      return res.status(500).send("Error al listar Costos");
    });
});
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
router.get("/productos/listarTodos", (req, res) => {
  console.log("Listando productos con unidades de medida");

  Catalogo_productos.findAll({
    where: {
      estado: "activo",
    },
    include: [
      {
        model: Catalogo_unidad_medida,
        as: "unidadMedida",
      },
      {
        model: Imagenes,
        as: "blobImage",
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
    material.descripcion = req.body.data.descripcion;
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
      fechaCompra: req.body.data.fechaCompra,
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
router.post("/combos/nuevoCombo/:comboName", async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.params.comboName", req.params.comboName);
  try {
    // Verificar si ya existe un combo "Sin nombre" y estado "activo"
    const comboSinNombre = await db.Combo_material.findOne({
      where: {
        nombreCombo: req.params.comboName,
        estado: "activo",
      },
    });

    // Si combo "Sin nombre" existe, úsalo; de lo contrario, crea uno
    let nuevoCombo;
    if (comboSinNombre) {
      nuevoCombo = comboSinNombre;
    } else {
      nuevoCombo = await db.Combo_material.create({
        nombreCombo: req.params.comboName,
        estado: "activo",
      });
    }

    // Agregar elementos de combo a través de req.body
    const elementosCombo = req.body; // Supongamos que elementosCombo es un arreglo de elementos

    // Iterar a través de los elementosCombo y crear las asociaciones con Combo_material_item
    for (const elemento of elementosCombo) {
      await db.Combo_material_item.create({
        combo_material_id: nuevoCombo.id,
        material_id: elemento.id, // Suponemos que elemento.id es el ID del material de Catalogo_material
      });
    }

    res
      .status(201)
      .json({ message: "Combo creado con éxito", combo: nuevoCombo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al crear el combo" });
  }
});

module.exports = router;
