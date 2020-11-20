const express = require('express');
const { findWhere } = require('underscore');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express(); // inicializamos la variable
let Producto = require('../models/producto');
let Categoria = require('..//models/categoria');


// ================================
//  Obtener productos
// ================================
app.get('/producto', verificaToken, (req, res) => {

    // trae todos los productos
    // populate: usuario y categoría
    // paginado

    let status = true;

    let desde = req.desde || 0;
    desde = Number(desde);

    let limite = req.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: status }, 'nombre descripcion precioUni categoria usuario')
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'nombre descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            };

            Producto.count({ disponible: status }, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err,
                    });
                };

                return res.json({
                    ok: true,
                    productos,
                    cuantos: conteo,
                });

            });

        });

});

// ================================
//  Obtener un producto por ID
// ================================
app.get('/producto/:id', verificaToken, (req, res) => {

    // trae todos los productos
    // populate: usuario y categoría

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'nombre descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            };

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    },
                });
            };

            return res.json({
                ok: true,
                productoDB,
            });

        });

});

// ================================
//  Buscar productos
// ================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); // RegExp es una expresión regular, es una función de js. Está basada en el término, y con 'i' la hacemos insensible a mayúsculas y minúsculas

    // Con esta búsqueda conseguimos todos los productos que contengan en su nombre, o parcialmente, la expresión
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            return res.json({
                ok: true,
                productos
            });

        });

});

// ================================
//  Crear un nuevo producto
// ================================
app.post('/producto', verificaToken, async(req, res) => {

    // grabar el usuario
    // grabar una categoría del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });

    console.log(producto.categoria);

    await Categoria.findOne({ nombre: body.categoria }, (err, categoriaDB) => {

        // Si llega un error lo devolvemos
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Hubo un problema',
                    err,
                },
            });
        };

        producto.categoria = categoriaDB._id;

        producto.save((err, producto) => {

            // Si llega un error lo devolvemos
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        mensaje: 'Hubo un problema',
                        err,
                    },
                });
            };

            // Si no llega un producto es que hubo un error
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: 'No se ha podido crear el producto'
                    }
                });
            };

            // Si está todo bien devolvemos los datos

            return res.json({
                ok: true,
                producto,
            });

        });

    });

});

// ================================
//  Actualizar un producto
// ================================
app.put('/producto/:id', verificaToken, async(req, res) => {

    // actualizar un producto

    let id = req.params.id;
    let body = req.body;

    await Categoria.findOne({ nombre: body.categoria }, (err, categoriaDB) => {

        body.categoria = categoriaDB._id;
        body.usuario = req.usuario._id

        Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            if (!productoDB) {

                return res.status(400).json({
                    ok: false,
                    err,
                });

            };

            return res.json({
                ok: true,
                productoDB
            });

        });

    });

});

// ================================
//  Borrar un producto
// ================================
app.delete('/producto/:id', verificaToken, (req, res) => {

    // En lugar de borrarlo físicamente lo quitamos de disponible = false

    let id = req.params.id;
    // let cambios = { disponible: false };

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true, context: 'query' }, (err, productoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        };

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err,
            });
        };

        return res.json({
            ok: true,
            productoBorrado
        });

    });


});


module.exports = app;