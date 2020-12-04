const express = require('express');
var mongoose = require('mongoose');

let app = express();
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaRole } = require('../middlewares/autenticacion');

let Categoria = require('../models/categoria');
let Producto = require('../models/producto');
const bodyParser = require('body-parser');
const { isValidObjectId } = require('mongoose');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// ============================
// Mostrar todos los productos
// ============================
app.get('/productos', (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        })


});

// ============================
// Obtener un producto por ID
// ============================
app.get('/productos/:id', (req, res) => {
    // populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id Producto no existe'
                }
            });
        }
        res.json({
            ok: true,
            categoria: productoDB
        })
    });
});


// ============================
// Buscar Productos
// ============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        })

});

// ============================
// Crear un Producto
// ============================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body;

    if (!mongoose.Types.ObjectId.isValid(body.categoria)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Id de Categoria No Es un Id Valido'
            }
        });
    }
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    Categoria.findById(producto.categoria, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id Categoria no existe'
                }
            });
        }
        producto.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });

        });

    });


});

// ============================
// Actualizar un Producto
// ============================
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;
    if (!mongoose.Types.ObjectId.isValid(body.categoria)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Id de Categoria No Es un Id Valido'
            }
        });
    }

    let productoUpdate = {
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria
    }
    Categoria.findById(productoUpdate.categoria, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id Categoria no existe'
                }
            });
        }
        Producto.findByIdAndUpdate(id, productoUpdate, { new: true, runValidators: true }, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });

        });
    });

});

// ============================
// Eliminar un Producto
// ============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // disponible false
    let id = req.params.id;

    let productoUpdate = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, productoUpdate, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });

    });

});


module.exports = app;