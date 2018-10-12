import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Pelicula = new Schema({
    Titulo: {
        type: String
    },
    Genero: {
        type: String
    },
    Director: {
        type: String
    },
    Franquicia: {
        type: String,
    },
    Pais: { 
        type: String
    },
    Estreno: {
        type: Number
    },
    Duracion: {
        type: Number
    },
    ProductoraObj: {
        Nombre: String,
        Fundacion: Number,
        DireccionWeb: String
    },
    Actores: {
        type: Array
    }

});

export default mongoose.model('Pelicula', Pelicula);