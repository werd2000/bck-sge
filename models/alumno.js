const { Schema, model } = require('mongoose');

const alumnoSchema = Schema({
    estado: {
        type: Schema.Types.ObjectId,
        ref: 'EstadoAlumno'
    },
    apellido: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    tipoDoc: {
        type: String
    },
    nroDoc: {
        type: String,
        required: true,
        unique: true
    },
    sexo: {
        type: String,
    },
    nacionalidad: {
        type: String,
    },
    fechaNac: {
        type: String,
    },
    img: {
        type: String
    },
    activo: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    }
});

alumnoSchema.method('toJSON', function() {
    const { __v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model( 'Alumno', alumnoSchema );
