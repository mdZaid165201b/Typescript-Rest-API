import * as Mongoose from "mongoose";

const CarSchema = new Mongoose.Schema({
    carName: {type: String, required: true},
    model: { type: String, required: true },
    rentalPrice: {type: String, required: true},
    companyID: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Company"
    }
},{ timestamps: true });

export const Car = Mongoose.model("Car", CarSchema);