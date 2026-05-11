const foodPartnerModel = require('../models/food-partner.model');

async function getFoodPartnerById(req, res) {
    const foodPartnerId = req.params.id;
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);

    if (!foodPartner) {
        return res.status(404).json({
            status: "error",
            message: "Food partner not found"
        })
    }

    res.status(200).json({
        status: "success",
        foodPartner,
        message: "Food partner fetched successfully"
    })
}