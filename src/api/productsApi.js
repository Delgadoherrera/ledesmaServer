const express = require("express");
const router = express.Router();
const db = require("../database/models");
const Catalogo_materiales = db.Catalogo_material;
const Compra_materiales = db.Compra_material;
const Cotizacion = db.Cotizacion;

var Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/materiales/nuevoMaterial", (req, res) => {
  console.log("Nuevo producto: req.body", req.body);
  const dir = req.body;
  Catalogo_materiales.create({
    descripcion: dir.descripcion,
    medida: dir.medida,
    unidadMedida: dir.unidadMedida,
  });
  res.status(200).send();
});

router.get("/materiales/listarTodos", (req, res) => {
  Catalogo_materiales.findAll()
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
      unidadMedida: req.body.data.unidadMedida,
    },
    {
      where: { id: req.params.id },
    }
  );
  res.status(200).send("success");
});

module.exports = router;
