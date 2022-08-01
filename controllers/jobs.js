const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');


const getAllJobs = async (req, res) => {
    // Traer AllJobs con el metodo .find pero solamente los del usuario según userID, y ordenando por fecha de creación .sort
    const jobs = await Job.find({ createdBy: req.user.userID }).sort('createdAt')
    // Enviando los jobs y la cantidad 
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
};

const getJob = async (req, res) => {
    // Se necesita destructurar del request tanto el ID del usuario como el parámetro del ID del job
    const { user: { userID }, params: { id: jobID } } = req

    // Buscar según el método .findOne donde _id (model DB) es jobID y createdBy(timestamp DB) es userID
    const job = await Job.findOne({ _id: jobID, createdBy: userID })

    //Comprobando errores
    if (!job) {
        throw new NotFoundError(`No job with ID: ${jobID}`)
    }
    res.status(StatusCodes.OK).json({ job })
};

const createJob = async (req, res) => {
    // Asignar el ID de usuario al job según la propiedad createdBy del modelo Job
    req.body.createdBy = req.user.userID
    // Crear el job con el metodo create
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
};

const updateJob = async (req, res) => {
    // Se necesita destructurar del request ID de user, ID de jobs de params, y del body company y position  
    const { user: { userID }, params: { id: jobID }, body: { company, position } } = req

    if (!company || !position) {
        throw new BadRequestError('Company or position fields can not be empty')
    }

    // A partir del método .findByIdAndUpdate(id/updateObject/options) buscar según job ID y usuario creador del mismo
    const job = await Job.findByIdAndUpdate({ _id: jobID, createdBy: userID }, req.body, { new: true, runValidators: true })

    if (!job) {
        throw new NotFoundError(`No job with ID: ${jobID}`)
    }
    res.status(StatusCodes.OK).json({ job })
};

const deleteJob = async (req, res) => {
    // Se necesita destructurar del request tanto el ID del usuario como el parámetro del ID del job
    const { user: { userID }, params: { id: jobID } } = req

    // El método es .findByIdAndDelete
    const job = await Job.findByIdAndDelete({_id: jobID, createdBy: userID})

    if(!job) {
        throw new NotFoundError(`No job with ID: ${jobID}`)
    }
    res.status(StatusCodes.OK).send()
};

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}
