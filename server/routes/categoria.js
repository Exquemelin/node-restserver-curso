const express = require('express');

// El underscore nos permite tomar una parte del body nada más
const _ = require('underscore'); // El guión bajo es el nombre más estandarizado

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// Todas las peticiones van a necesitar un token

// ================================
//  Mostrar todas las categorías
// ================================
app.get('/categoria', verificaToken, (req, res) => {

    // Tienen que aparecer todas las categorías. No hace falta paginar

    let status = true;

    let desde = req.query.desde || 0;
    desde = Number(desde); // Convierte la variable en un número

    let limite = req.query.limite || 5;
    limite = Number(limite); // Convierte la variable en un número

    Categoria.find({ estado: status }, 'nombre descripcion img estado usuario') // Se le pueden agregar filtros para acotar la búsqueda. Con la segunda parte indicamos los campos a mostrar.
        .sort('nombre')
        .skip(desde) // Se va a saltar los primeros x registros
        .limit(limite) // Limita los usuarios devueltos al número marcado, en lugar de listar todos
        .populate('usuario', 'nombre email') // Carga objetos de otra tabla, y le podemos decir qué datos queremos que cargue, el ID siempre lo carga
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            };

            Categoria.count({ estado: status }, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantas: conteo,
                });

            })


        });

});

// ================================
//  Mostrar una categoría
// ================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    // Categoria.findById(....)
    Categoria.findById(req.params.id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
            });
        };

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        };

        return res.json({
            ok: true,
            categoria: categoriaDB,
        });

    });


});

// ================================
//  Crear una nueva categoría
// ================================
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
    // regresa la nueva categoría
    // req.usuario._id al verificar el token lo podremos obtener

    let body = req.body;

    // Creamos un objeto usuario y le cargamos los datos que nos entran desde la petición
    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        img: body.img,
        estado: body.estado,
        usuario: req.usuario._id
    });

    // Lo guardamos en la base de datos, y nos retornará un error o un usuario, el guardado
    categoria.save((err, categoriaDB) => {

        // Si llega un error lo lanzamos, y con el return salimos de la función
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        };

        // Si no nos llega una categoría, es que hubo un problema
        if (!categoriaDB) {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            };

        }

        // Si fue todo bien, lanzamos una respuesta con el ok, y el usuario que se guardó
        return res.json({
            ok: true,
            categoria: categoriaDB,
        });

    });

});

// ==================================
//  Actualizar una de las categorías
// ==================================
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    // let body = _.pick(req.body, ['nombre', 'descripcion', 'img', 'estado', 'usuario']);
    let body = req.body;

    let cambios = {
        nombre: body.nombre,
        // descripcion: body.descripcion,
        // img: body.img
    }

    // Actualizar la descripción de la categoría
    Categoria.findByIdAndUpdate(id, cambios, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        // Si llega un error lo lanzamos, y con el return salimos de la función
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        };

        // Si no nos llega una categoría, es que hubo un problema
        if (!categoriaDB) {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            };

        }

        // Si fue todo bien, lanzamos una respuesta con el ok, y la categoría como se guardó
        return res.json({
            ok: true,
            categoria: categoriaDB,
        });

    });

    // res.json({
    //     ok: true,
    //     requisicion: req.body,
    // })

});

// ================================
//  Borrar una las categorías
// ================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    // Solo la va a poder borrar un administrador
    // Se va a eliminar directamente, no solo desactivarla
    // Categoria.findByIdAndRemove(....)

    Categoria.findByIdAndRemove(req.params.id, (err, categoriaBorrada) => {

        // Si llega un error lo lanzamos, y con el return salimos de la función
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        };

        if (!categoriaBorrada) {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoría no encontrada',
                    },
                });
            };

        } else {
            // Si fue todo bien, lanzamos una respuesta con el ok, y la categoría como se guardó
            return res.json({
                ok: true,
                categoria: categoriaBorrada,
            });

        };

    });

    // res.json({
    //     ok: true,
    //     message: 'Borrar una categorías'
    // });

});




module.exports = app;