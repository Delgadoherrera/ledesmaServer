const express = require("express");
const router = express.Router();
const db = require("../database/models");
const Catalogo_materiales = db.Catalogo_materiales;
const Compra_materiales = db.Compra_materiales;
const Cotizacion = db.Cotizacion;

var Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/materiales/nuevoMaterial", (req, res) => {
  console.log("Nuevo producto: req.body", req.body);
  const dir = req.body;
  Catalogo_materiales.create({
    descripcion: dir.descripcion,
    tamano: dir.tamano,
    unidadMedida:dir.unidadMedida
  });
  res.status(200).send();
});

router.get("/materiales/listarTodos", (req, res) => {
  Catalogo_materiales.findAll()
    .then(function (materiales) {
      console.log("materiales", materiales);
      return res.status(200).send(materiales);
    })
    .catch((error) => {
      console.log("error catch" + error);
    });
});

module.exports = router;
