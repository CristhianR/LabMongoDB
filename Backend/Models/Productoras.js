import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Productora = new Schema({
    Nombre: {
        type: String
    },
    Fundacion: {
        type: String
    },
    DireccionWeb: {
        type: String
    }

});

export default mongoose.model('Productora', Productora);