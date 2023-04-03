import {HydratedDocument, Types} from "mongoose";

export interface CarInterface extends HydratedDocument<any>{
    carName?: String,
    model?: String,
    rentalPrice?: String,
    companyID?: Types.ObjectId
    createdAt?: Date,
    updatedAt?: Date
}