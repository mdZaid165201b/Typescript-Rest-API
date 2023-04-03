import * as mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    cars: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
        }
    ]
}, { timestamps: true });

export const Company = mongoose.model("Company", CompanySchema);