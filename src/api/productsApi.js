const express = require("express");
const router = express.Router();
const db = require("../database/models");
const Catalogo_materiales = db.Catalogo_material;
const Compra_materiales = db.Compra_material;
const Cotizacion = db.Cotizacion;
const Catalogo_unidad_medida = db.Catalogo_unidad_medida;

var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const objetoFecha = Date.now();
const nowDate = new Date(objetoFecha);
const fecha = nowDate.toLocaleDateString("en-ZA");
/* router.post("/materiales/nuevoMaterial", async (req, res) => {
  try {
    const dir = req.body;

    // Verifica si la unidad de medida ya existe en la base de datos
    let unidadMedidaExistente = await Catalogo_unidad_medida.findOne({
      where: {
        unidadMedida: dir.unidadMedida,
      },
    });

    if (!unidadMedidaExistente) {
      // Si la unidad de medida no existe, créala
      unidadMedidaExistente = await Catalogo_unidad_medida.create({
        unidadMedida: dir.unidadMedida,
      });
    }

    // Crea el nuevo material con referencia a la unidad de medida
    const nuevoMaterial = await Catalogo_materiales.create({
      descripcion: dir.descripcion,
      medida: dir.medida,
      estado: "activo",
    });

    return res.status(201).json(nuevoMaterial);
  } catch (error) {
    console.error("Error al crear un nuevo material:", error);
    return res.status(500).send("Error al crear un nuevo material");
  }
}); */
// Ruta para dar de alta un nuevo material con su unidad de medida
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

    // Crea el material y asócialo con la unidad de medida existente
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
/* router.post("/materiales/nuevoMaterial", async (req, res) => {
  console.log("Nuevo producto: req.body", req.body);
  const dir = req.body;

  // Corrige la consulta para buscar en función de la descripción y la medida en lugar de "unidadMedida"
  const materialExistente = await Catalogo_materiales.findOne({
    where: {
      descripcion: dir.descripcion,
      medida: dir.medida,
    },
  });

  if (materialExistente) {
    // Si el material ya existe, puedes manejarlo aquí
    console.log("El material ya existe en la base de datos.");
  } else {
    // Si el material no existe, créalo
    await Catalogo_materiales.create({
      descripcion: dir.descripcion,
      medida: dir.medida,
      unidadMedida: dir.unidadMedida,
    });
  }

  res.status(200).send();
}); */
router.post("/materiales/nuevoMaterial", async (req, res) => {
  console.log("Nuevo producto: req.body", req.body);
  const dir = req.body;

  res.status(200).send();
});
router.get("/materiales/listarTodos", (req, res) => {
  console.log("Listando productos con unidades de medida");

  Catalogo_materiales.findAll({
    where: {
      estado: "activo", // Agrega esta condición para filtrar solo los materiales activos
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
  const { nuevaUnidadMedida } = req.body;

  try {
    // Verificar si la nueva unidad de medida ya existe
    let unidadMedidaExistente = await Catalogo_unidad_medida.findOne({
      where: {
        unidadMedida: nuevaUnidadMedida,
      },
    });

    if (!unidadMedidaExistente) {
      // Si no existe, créala
      unidadMedidaExistente = await Catalogo_unidad_medida.create({
        unidadMedida: nuevaUnidadMedida,
      });
    }
    console.log('unidadMedidaExistente ID', unidadMedidaExistente)
    // Busca el material por su ID
    const material = await db.Catalogo_material.findByPk(materialId);

    if (!material) {
      return res.status(404).json({ error: "Material no encontrado" });
    }

    // Actualiza la unidad de medida asociada al material
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
  try {
    console.log("Nuevo producto: req.body", req.body);
    console.log("paramId", req.params.id);
    const dir = req.body.data;
    console.log("DIR", dir);

    // Acceder a la unidad de medida y la medida desde req.body
    const unidadMedida = req.body.unidadMedida;
    const medida = req.body.medida;

    // Crear una nueva compra
    const nuevaCompra = await Compra_materiales.create({
      idMaterial: req.params.id,
      fechaCompra: fecha, // Asegúrate de que 'fecha' esté definido antes
      precioPesos: dir.precioPesos,
      conversion: dir.conversion,
      medidaId: dir.medidaId, // Proporciona el valor de medidaId
      medida: dir.medida,
    });

    // Obten el ID de la compra recién creada
    const compraId = nuevaCompra.idCompra;

    // Crear una nueva cotización y asignar 'compraId' correctamente
    const nuevaCotizacion = await Cotizacion.create({
      fechaCotizacion: fecha, // Usa la misma 'fecha' que se usó para la compra
      conversion: dir.conversion, // Usar el valor de conversion
      compraId: compraId, // Asocia la cotización con la compra
    });

    res.status(200).send("Compra y cotización creadas con éxito");
  } catch (error) {
    console.error("Error al realizar la compra y cotización:", error);
    res.status(500).send("Error al realizar la compra y cotización");
  }
});

/* router.get("/compras/listarTodas", (req, res) => {
  Compra_materiales.findAll({
    include: [
      {
        model: Catalogo_materiales,
        as: "catalogo_material",
      },
    ],
  })
    .then(function (compras) {
      console.log("COMPRAS con INCLUDE", compras);
      return res.status(200).send(compras);
    })
    .catch((error) => {
      console.log("Error al listar compras: " + error);
    });
}); */
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
module.exports = router;
