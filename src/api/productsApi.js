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

//MATERIALES

router.post("/materiales/nuevoMaterial", async (req, res) => {
  console.log("Nuevo producto: req.body", req.body);
  const dir = req.body;

  // Primero, verifica si la unidad de medida ya existe en Catalogo_unidad_medida
  const unidadMedidaExistente = await Catalogo_unidad_medida.findOne({
    where: { unidadMedida: dir.unidadMedida },
  });

  if (unidadMedidaExistente) {
    // Si la unidad de medida existe, crea el nuevo producto en Catalogo_material
    await Catalogo_materiales.create({
      descripcion: dir.descripcion,
      medida: dir.medida,
      unidadMedida: unidadMedidaExistente.id, // Asociación al ID de la unidad de medida existente
    });
  } else {
    // Si la unidad de medida no existe, primero créala y luego crea el producto
    const nuevaUnidadMedida = await Catalogo_unidad_medida.create({
      unidadMedida: dir.unidadMedida,
    });

    await Catalogo_materiales.create({
      descripcion: dir.descripcion,
      medida: dir.medida,
      unidadMedida: nuevaUnidadMedida.id, 
    });
  }

  res.status(200).send();
});
router.get("/materiales/listarTodos", (req, res) => {
  console.log("Listando productos con unidades de medida");

  Catalogo_materiales.findAll({
    include: [
      {
        model: Catalogo_unidad_medida,
        as: "unidadMedida",
      },
    ],
  })
    .then(function (materiales) {
      console.log("LOS MATERIALES", materiales);
      return res.status(200).send(materiales);
    })
    .catch((error) => {
      console.log("Error: " + error);
    });
});

router.post("/materiales/borrarMaterial/:id", (req, res) => {
  Catalogo_materiales.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).send("success");
});

router.post("/materiales/editar/:id", async (req, res) => {
  console.log("editar material:", req.body);
  Catalogo_materiales.update(
    {
      descripcion: req.body.data.descripcion,
      medida: req.body.data.medida,
    },
    {
      where: { id: req.params.id },
    }
  );
  res.status(200).send("success");
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
    precioDolar: dir.precioDolar,
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
      precioDolar: dir.precioDolar,
      unidadMedida: unidadMedida,
      medida: medida,
    });
    
    // Crear una nueva cotización y asignar 'idCompra' correctamente
    const nuevaCotizacion = await Cotizacion.create({
      idCompra: nuevaCompra.idCompra, // Utiliza el ID de la compra recién creada
      fechaCotizacion: fecha, // Usa la misma 'fecha' que se usó para la compra
      conversion: dir.precioDolar, // Usar el valor de precioDolar
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
    ],
  })
    .then(function (compras) {
      console.log("COMPRAS con INCLUDE", compras);
      return res.status(200).send(compras);
    })
    .catch((error) => {
      console.log("Error al listar compras: " + error);
    });
});

module.exports = router;
