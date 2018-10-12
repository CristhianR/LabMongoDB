import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Peliculas from './Models/Peliculas';
import Productoras from './Models/Productoras';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/peliculas');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

router.route('/consulta/:id').get((req,res) => {
    console.log(req.params.id);
    Peliculas.ensureIndexes({"ProductoraObj.Nombre":1,"ProductoraObj.Fundacion":1,"ProductoraObj.DireccionWeb":1});
    Peliculas.find({ $or: [{Titulo: req.params.id}, {Franquicia: req.params.id}, { "ProductoraObj.Nombre": req.params.id}]}, (err, peliculas) =>  {
        if(err){
            console.log(err);
        }else{
            res.json(peliculas);
        }
    });
});

router.route('/consulta2/:id').get((req,res) => {
    console.log(req.params.id);
    var index = 0;
    var PeliculaL;
    var PeliculaG;
    var Duracion = 0;
    Peliculas.ensureIndexes({"ProductoraObj.Nombre":1,"ProductoraObj.Fundacion":1,"ProductoraObj.DireccionWeb":1});
    Peliculas.find({ "ProductoraObj.Nombre": req.params.id}, (err, peliculas) =>  {
        if(err){
            console.log(err);
        }else{
            for(index = 0;index < peliculas.length; index ++){
                Duracion += peliculas[index].Duracion;
                if(index == peliculas.length-1){
                    break;
                }else{
                    if(peliculas[index].Duracion <= peliculas[index+1].Duracion){
                        PeliculaL = peliculas[index];
                        PeliculaG = peliculas[index+1];
                    }else{
                        PeliculaL = peliculas[index+1];
                        PeliculaG = peliculas[index];
                    }
                }   
            }
            var Cantidad = peliculas.length;
            var Promedio = Duracion/Cantidad;
            var obj = {
                Cantidad,
                PeliculaL,
                PeliculaG,
                Promedio
            };
            console.log(obj);
            res.json(obj);
        }
    });
});

router.route('/consulta3/:year1/:year2').get((req,res) => {
    var y1 = 0;
    var y2 = 0;
    y1 = parseInt(req.params.year1,10);
    y2 = parseInt(req.params.year2,10);
    Peliculas.find({Estreno:{ $gte: y1, $lte: y2}}, (err, peliculas) =>  {
        if(err){
            console.log(err);
        }else{
            res.json(peliculas);
        }
    });
});


//----------------------------------------------- End-points -----------------------------------------------------------

//---------------------------------------- Métodos CRUD para el modelo PELICULAS --------------------------------------------

// GET ALL
router.route('/peliculas').get((req, res) => {
    Peliculas.find((err, peliculas) => {
        if(err){
            console.log(err);
        }else{
            res.json(peliculas);
        }
    });
});

// GET byID
router.route('/pelicula/:id').get((req, res) => {
    Peliculas.findById(req.params.id, (err, pelicula) => {
        if(err){
            console.log(err);
        }else{
            res.json(pelicula);
        }
    });
});

// POST
router.route('/pelicula/add').post((req, res) => {
    let pelicula = new Peliculas(req.body);
    pelicula.save()
    .then(pelicula => {
        res.status(200).json({'pelicula': 'Added successfully'});
    })
    .catch(err => {
        res.status(400).send('Failed to create new record');
    });
});

// UPDATE
router.route('/pelicula/update/:id').post((req, res) => {
    Peliculas.findById(req.params.id, (err, pelicula) => {
        if(!pelicula){
            return next(new Error('Could not load document'));
        }else{
            pelicula.Nombre = req.body.Nombre;
            pelicula.Genero = req.body.Genero;
            pelicula.Director = req.body.Director;
            pelicula.Franquisia = req.body.Franquisia;
            pelicula.Pais = req.body.Pais;
            pelicula.Estreno = req.body.Estreno;
            pelicula.Duracion = req.body.Duracion;
            pelicula.Productora = req.body.Productora;
            pelicula.Actores = req.body.Actores;

            pelicula.save().then(pelicula => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

// DELETE
router.route('/pelicula/delete/:id').get((req, res) => {
    Peliculas.findByIdAndRemove({_id: req.params.id}, (err, pelicula) => {
        if(err){
            res.json(err);
        }else{
            res.json('Remove successfully');
        }
    })
})

//---------------------------------------- Métodos CRUD para el modelo PRODUCTORAS --------------------------------------------

// GET ALL
router.route('/productoras').get((req, res) => {
    Productoras.find((err, productoras) => {
        if(err){
            console.log(err);
        }else{
            res.json(productoras);
        }
    });
});

// GET byID
router.route('/productora/:id').get((req, res) => {
    Productoras.findById(req.params.id, (err, productora) => {
        if(err){
            console.log(err);
        }else{
            res.json(productora);
        }
    });
});

// POST
router.route('/productora/add').post((req, res) => {
    let productora = new Productoras(req.body);
    productora.save()
    .then(productora => {
        res.status(200).json({'productora': 'Added successfully'});
    })
    .catch(err => {
        res.status(400).send('Failed to create new record');
    });
});

// UPDATE
router.route('/productora/update/:id').post((req, res) => {
    Productoras.findById(req.params.id, (err, productoras) => {
        if(!productoras){
            return next(new Error('Could not load document'));
        }else{
            productora.Nombre = req.body.Nombre;
            productora.Fundacion = req.body.Fundacion;
            productora.DireccionWeb = req.body.DireccionWeb;

            productora.save().then(user => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

// DELETE
router.route('/productora/delete/:id').get((req, res) => {
    Productoras.findByIdAndRemove({_id: req.params.id}, (err, productora) => {
        if(err){
            res.json(err);
        }else{
            res.json('Remove successfully');
        }
    })
})

app.use('/', router);

app.get('/', (req, res) => res.send("Hello"));
app.listen(4000, () => console.log('Express server running on port 4000'));