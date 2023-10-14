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
router.post("/materiales/nuevoMaterial", async (req, res) => {
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
});

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

router.post("/materiales/editar/:id", async (req, res) => {
  try {
    const dir = req.body.data;
    console.log("dir", dir);

    // Busca el material existente que deseas editar
    const materialExistente = await Catalogo_materiales.findByPk(req.params.id);

    if (!materialExistente) {
      return res.status(404).json({ message: "Material no encontrado" });
    }

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
    console.log("unidadMedidaExistente", unidadMedidaExistente);
    console.log("materialExistente", materialExistente);

    // Actualiza el material con la nueva descripción y unidad de medida
    await materialExistente.update({
      descripcion: dir.descripcion,
      medida: dir.medida,
    });

    return res.status(200).json({ message: "Material actualizado" });
  } catch (error) {
    console.error("Error al actualizar el material:", error);
    return res.status(500).send("Error al actualizar el material");
  }
});
// COMPRAS
/* router.post("/materiales/comprar/:id", (req, res) => {
  console.log("Nuevo producto: req.body", req.body);
  console.log("paramId", req.params.id);
  const dir = req.body.data;
  console.log("DIR", dir);
  Compra_materiales.create({
    idMaterial: req.params.id,
    fechaCompra: fecha,
    precioPesos: dir.precioPesos,
    conversion: dir.conversion,
  });
  res.status(200).send();
});
 */

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
