const { Schema, model } = require('mongoose');

const estadoAlumnoSchema = Schema({
    estado: {
        type: String,
        unique: true
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

estadoAlumnoSchema.method('toJSON', function() {
    const { __v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model( 'EstadoAlumno', estadoAlumnoSchema );
