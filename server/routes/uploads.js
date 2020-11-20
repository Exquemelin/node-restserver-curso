const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// delfault options
app.use(fileUpload()); // Este es un middleware que hace que todos los archivos que se carguen vayan al request en un objeto llamado files

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    mensaje: 'No se ha seleccionado ningún archivo'
                }
            });
    };

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                mensaje: 'Las tipos permitidos son ' + tiposValidos.join(', '), // el método ".join()" une el arreglo en un solo string, pero le decimos que lo una poniendo ', ' en medio
                tipo,
            },
        });
    };

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.'); // Con esto segmentamos el nombre del archivo en partes usando el '.' como separador. Nos devuelve un array
    let extension = nombreCortado[nombreCortado.length - 1]

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    // Si no es una extensión válida lanzamos un error y nos salimos de la función
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                mensaje: 'Las extensiones válidas son ' + extensionesValidas.join(', '), // el método ".join()" une el arreglo en un solo string, pero le decimos que lo una poniendo ', ' en medio
                ext: extension,
            },
        });
    }

    // Cambiar nombre al archivo
    // Obtendremos un nombre: dflkasjdfklasdj-345.jpg haciéndolo único
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Usamos el método mv() para decir la ruta donde debemos almacenar el archivo
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        };

        // Aquí ya tenemos la imagen cargada.

        // Si fueran más tipos, sería mejor utilizar un switch case of
        if (tipo === 'usuarios') {

            imagenUsuario(id, res, nombreArchivo);

        } else if (tipo === 'productos') {

            imagenProducto(id, res, nombreArchivo);

        }

        // res.json({
        //     ok: true,
        //     mensaje: 'Archivo subido correctamente',
        // });

    });

});

// Necesitamos el objeto "res" para poder utilizarlo en la función, lo ponemos en los párametros de entrada
function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            // Si hubo un error, eliminamos la imagen subida
            borraArchivo(usuarioDB.img, 'usuarios');

            return res.status(500).json({
                ok: false,
                err,
            });
        };

        if (!usuarioDB) {

            // Si hubo un error, eliminamos la imagen subida
            borraArchivo(usuarioDB.img, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'El usuario no existe',
                },
            });
        };

        // // construimos el path que debería tener el archivo existente
        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${ usuarioDB.img }`);
        // // la siguiente función de fs nos dará un true si existe el path, o un false en caso contrario
        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen); // Esto nos borrará el archivo
        // }

        // Con esta función borramos el archivo que queremos. Le decimos el nombre y el tipo
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo,
            });

        });

    });

};

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {

            // Si hubo un error borramos la imagen cargada
            borraArchivo(productoDB.img, 'productos');

            return res.status(500).json({
                ok: false,
                err,
            });
        };

        if (!productoDB) {

            // Si hubo un error borramos la imagen cargada
            borraArchivo(productoDB.img, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'El producto no existe'
                },
            });
        };

        // Borramos el archivo que ya está cargado, si existe
        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo,
            });

        });

    });



};

function borraArchivo(nombreImagen, tipo) {

    // construimos el path que debería tener el archivo existente
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    // la siguiente función de fs nos dará un true si existe el path, o un false en caso contrario
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen); // Esto nos borrará el archivo
    }

};

module.exports = app;