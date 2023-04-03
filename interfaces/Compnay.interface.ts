import {HydratedDocument, Types} from "mongoose";

export interface CompanyInterface extends HydratedDocument<any>{
    name: String,
    email: String,
    cars?: Array<Types.ObjectId>,
    createdAt?: Date,
    updatedAt?: Date
}