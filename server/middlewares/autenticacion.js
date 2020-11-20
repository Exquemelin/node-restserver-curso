const jwt = require('jsonwebtoken')


// ==============================
//  Verificar Token
// ==============================
let verificaToken = (req, res, next) => {

    let token = req.get('token'); // Es el nombre que le dimos en los headers de la petición

    // res.json({
    //     token: token
    // });

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    token,
                    message: 'Token no válido'
                }
            });
        };

        req.usuario = decoded.usuario; // En el objeto codificado en el token hay un objeto usuario, por eso lo tendremos en el decoded también, y lo cargamos en el request
        // console.log(decoded);
        next();

    });

    // console.log(token);

    // next();

};

// ==============================
//  Verificar Admin_Role
// ==============================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no tiene permisos para realizar esa acción'
            }
        })
    }

    next();

}


module.exports = {
    verificaToken,
    verificaAdmin_Role,
}