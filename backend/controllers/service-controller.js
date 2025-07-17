const Service = require("../models/service-model")
const services = async(req,res)=>{
    try {
        const response = await Service.find();
        if(!response){
            res.status(404).json({msg:"No service foound"});
            return;
        }
        res.status(200).json({msg:response});

    } catch (error) {
        
    }

}

module.exports = services;