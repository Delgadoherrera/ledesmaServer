const express = require("express");
const router = express.Router();
const db = require("../database/models");
const Producto = db.Producto;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/productos/nuevoProducto", (req, res) => {
  console.log("Nuevo producto: req.body", req.body);
  const dir = req.body;
  Producto.create({
    codigo: dir.codigo,
    descripcion: dir.descripcion,
    largo: dir.largo,
    ancho: dir.ancho,
    unidadMedida: dir.unidadMedida,
    cantidad: dir.cantidad,
  });
  res.status(200).send();
});

router.get("/productos/listarTodos", (req, res) => {
  console.log("req", req);
  Producto.findAll()
    .then(function (productos) {
      console.log("productos", productos);
      return res.status(200).send(productos);
    })
    .catch((error) => {
      console.log("error catch" + error);
    });
});

module.exports = router;
