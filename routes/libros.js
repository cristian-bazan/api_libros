const express = require('express');
const router = express.Router();
const libros = require('../data');
const Joi = require('joi');

const libroSchema = Joi.object({
    titulo: Joi.string().required().label('Titulo'),
    autor: Joi.string().required().label('Autor')
});

//Obtener todos los Libros
router.get('/', (request, response, next) => {
    try {
        response.json(libros);
    } catch(err) {
        next(err);
    }
});

//Obtener Libro por id
router.get('/:id', (request, response, next) => {
    try {
        const id = request.params.id;
        const libro = libros.find((l) => l.id === id);

        if (!libro) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
        }
        response.json(libro);
    } catch (err) {
        next(err);
    }
});

//Crear nuevo Libro
router.post('/', (request, response, next) => {
    try {
        const {error, value} = libroSchema.validate(request.body);
        if (error) {
        const validationError = new Error('Error de validacion');
        validationError.status = 400;
        validationError.details = error.details.map(detail => detail.message);
        throw validationError;
        }
        const {titulo, autor} = value;

        const nuevoLibro = {
            id: libros.length + 1,
            titulo,
            autor
        };

        libros.push(nuevoLibro);
        response.status(201).json(nuevoLibro);
    } catch (err) {
        next(err);
    }
});

//Actualizar Libro existente
router.put('/:id', (request, response, next) => {
    try {
        const id = request.params.id;
        const {error, value} = libroSchema.validate(request.body);
        if (error) {
        const validationError = new Error('Error de validacion');
        validationError.status = 400;
        validationError.details = error.details.map(detail => detail.message);
        throw validationError;
        }
        const {titulo, autor} = value;

        const libro = libros.find((l) => l.id === id);

        if (!libro) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
        }

        libro.titulo = titulo || libro.titulo;
        libro.autor = autor || libro.autor;

        response.json(libro);
    } catch (err) {
        next(err);
    }
});

//Eliminar Libro
router.delete('/:id', (request, response, next) => {
    try {
        const id = request.params.id;
        const index = libros.findIndex((l) => l.id === id);

        if (index === -1) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
        }

        const libroEliminado = libros.splice(index, 1);
        response.json(libroEliminado[0]);
    } catch (err) {
        next(err);
    }
});

module.exports = router;