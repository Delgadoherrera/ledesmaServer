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

router.post("/materiales/nuevoMaterial", (req, res) => {
  console.log("Nuevo producto: req.body", req.body);
  const dir = req.body;

  // Verifica que la unidad de medida exista en la tabla catalogo_unidad_medida
  Catalogo_unidad_medida.findOne({
    where: {
      unidadMedida: dir.unidadMedida,
    },
  })
    .then((unidadMedidaEncontrada) => {
      if (unidadMedidaEncontrada) {
        // Si se encontró la unidad de medida, crea un nuevo material
        Catalogo_materiales.create({
          descripcion: dir.descripcion,
          medida: dir.medida,
          unidadMedida: unidadMedidaEncontrada.id, // Asocia con el id de la unidad de medida
        })
          .then((nuevoMaterial) => {
            res.status(200).send(nuevoMaterial);
          })
          .catch((error) => {
            console.log("Error al crear nuevo material: " + error);
            res.status(500).send("Error al crear nuevo material");
          });
      } else {
        // La unidad de medida no se encontró, maneja el error
        res.status(400).send("La unidad de medida no existe");
      }
    })
    .catch((error) => {
      console.log("Error al buscar unidad de medida: " + error);
      res.status(500).send("Error al buscar unidad de medida");
    });
});
router.get("/materiales/listarTodos", (req, res) => {
  console.log("listando productos");
  Catalogo_materiales.findAll({
    include: [
      {
        model: Catalogo_unidad_medida, // Nombre del modelo
        as: "unidadMedida", // Alias para la relación
      },
    ],
  })

    .then(function (materiales) {
      return res.status(200).send(materiales);
    })
    .catch((error) => {
      console.log("error catch" + error);
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
router.post("/materiales/comprar/:id", (req, res) => {
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

router.get("/compras/listarTodas", (req, res) => {
  Compra_materiales.findAll({
    include: [
      {
        model: Catalogo_materiales,
        as: "catalogo_material", // Alias para la relación
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
