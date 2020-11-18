const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore'); // El guión bajo es el nombre más estandarizado

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const app = express();


app.get('/usuario', function(req, res) {

    let status = true;

    let desde = req.query.desde || 0;
    desde = Number(desde); // Convierte la variable en un número

    let limite = req.query.limite || 5;
    limite = Number(limite); // Convierte la variable en un número

    Usuario.find({ estado: status }, 'nombre email role estado img') // Se le pueden agregar filtros para acotar la búsqueda. Con la segunda parte indicamos los campos a mostrar.
        .skip(desde) // Se va a saltar los primeros x registros
        .limit(limite) // Limita los usuarios devueltos al número marcado, en lugar de listar todos
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err,
                });
            };

            Usuario.count({ estado: status }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo,
                });

            })


        }); // El exec es la orden de ejecutar la búsqueda, y en ella con una función de flecha decimos qué hay que hacer con los datos.

});

app.post('/usuario', function(req, res) {

    let body = req.body;

    // Creamos un objeto usuario y le cargamos los datos que nos entran desde la petición
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    // Lo guardamos en la base de datos, y nos retornará un error o un usuario, el guardado
    usuario.save((err, usuarioDB) => {

        // Si llega un error lo lanzamos, y con el return salimos de la función
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
            });
        };

        // usuarioDB.password = null; // Una forma de eliminar el password de la respuesta

        // Si fue todo bien, lanzamos una respuesta con el ok, y el usuario que se guardó
        res.json({
            ok: true,
            usuario: usuarioDB,
        });

    });

    // Lo guardamos en la base de datos, y nos retornará un error o un usuario, el guardado
    // usuario.save()
    //     .then(usuarioDB => {

    //         return res.json({
    //             // ok: true,
    //             usuario: usuarioDB,
    //         });

    //     })
    //     .catch(err => {

    //         return res.status(400).json({
    //             // ok: false,
    //             err: err,
    //         });

    //     });

    // (err, usuarioDB) => {

    // // Si llega un error lo lanzamos, y con el return salimos de la función
    // if (err) {
    // };

    // // Si fue todo bien, lanzamos una respuesta con el ok, y el usuario que se guardó
    // res.json({
    //     ok: true,
    //     usuario: usuarioDB,
    // });

    // });

    // if (body.nombre === undefined) {

    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario',
    //     });

    // } else {

    //     res.json({
    //         persona: body
    //     });

    // }

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // El 'new: true' hace que nos devuelva los datos del nuevo usuario
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        };

        res.json({
            ok: true,
            usuario: usuarioDB,
        })
    });

});

app.delete('/usuario/:id', function(req, res) {

    // Cogemos el ide de la url que nos mandan
    let id = req.params.id;
    let body = _.pick(req.body, ['estado']);
    body.estado = false;

    // // Eliminamos el registro de la base de datos directamente
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err,
    //         });
    //     };

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             },
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });

    // })

    // Eliminamos el registro poniendo su estado en false
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        };

        res.json({
            ok: true,
            usuario: usuarioDB,
        })

    })

});

module.exports = app;