const foodPartnerModel = require('../models/food-partner.model');
const foodModel = require("../models/food.model")

async function getFoodPartnerById(req, res) {
    const foodPartnerId = req.params.id;
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);

    const foodItemsByFoodPartner = await foodModel.find({foodPartnerId:foodPartnerId});

    if (!foodPartner) {
        return res.status(404).json({
            status: "error",
            message: "Food partner not found"
        })
    }

    res.status(200).json({
        status: "success",
        foodPartner:{
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner,
            
        }
    })  
}
