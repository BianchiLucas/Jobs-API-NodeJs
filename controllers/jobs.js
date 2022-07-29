const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');


const getAllJobs = async (req, res) => {
    // Traer AllJobs con el metodo .find pero solamente los del usuario según userID, y ordenando por fecha de creación .sort
    const jobs = await Job.find({ createdBy: req.user.userID }).sort('createdAt')
    // Enviando los jobs y la cantidad 
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
};

const getJob = async (req, res) => {
    res.send('Get job')
};

const createJob = async (req, res) => {
    // Asignar el ID de usuario al job según la propiedad createdBy del modelo Job
    req.body.createdBy = req.user.userID
    // Crear el job con el metodo create
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
};

const updateJob = async (req, res) => {
    res.send('Update job')
};

const deleteJob = async (req, res) => {
    res.send('Delete job1')
};

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}
