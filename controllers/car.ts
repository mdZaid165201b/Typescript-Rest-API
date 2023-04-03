import {Request, Response} from "express";
import {Controller ,Post, Get, Delete, Put} from "@overnightjs/core";
import {Types} from "mongoose"
import { CarInterface } from "../interfaces/Car.interface";
import {CompanyInterface} from "../interfaces/Compnay.interface";
import {Car} from "../models/Cars";
import { Company } from "../models/Company";
import {CompanyController} from "./Company";

@Controller("api/car")
export  class CarController {
    @Post("create")
    private async createCar (req: Request, res: Response) : Promise<void> {
        try{
            if(req.headers["companyid"]) {
                const fetchedCompany: CompanyInterface | null = await  Company.findById(req.headers.companyid);
                const companyID =new  Types.ObjectId(String(req.headers["companyid"]));
                const carObject: CarInterface | null = new Car({
                    carName: req.body.carName,
                    model: req.body.model,
                    rentalPrice: req.body.rentalPrice,
                    companyID: companyID
                });
                const responseCar =  await carObject.save();
                if(fetchedCompany) {
                    const carID = responseCar._doc._id;
                    fetchedCompany.cars!.push(carID);
                    await fetchedCompany!.save();
                }

                res.status(201).json({
                    success: true,
                    carObject
                })

            }
            else{
                res.status(404).json({
                    success: false,
                    message: "companyID is missing!!!"
                })
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                scucess: false,
                message: "internal server error"
            })
        }
    }
    @Get("getCar/:id")
    private async getCar (req: Request, res: Response) :Promise<void> {
        try{
            const fetchedCar: CarInterface | null = await Car.findById(req.params.id);
            if(fetchedCar){
             res.status(200).json({success: true, fetchedCar})
            }
            else{
                res.status(404).json({
                    success: false,
                    message: "car not found!!!"
                })
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                success: false,
                message: "internal server error"
            })
        }
    }
    @Put("update/:id")
    private async updateCar(req: Request, res: Response) : Promise<void>{
        try{
            const fetchedCar: CarInterface | null = await Car.findById(req.params.id);
            if(fetchedCar) {
                const carUpdatedObject: CarInterface = new Car({
                    carName: req.body.carName === undefined ? fetchedCar.carName : req.body.carName,
                    model: req.body.model === undefined ? fetchedCar.model : req.body.model,
                    rentalPrice: req.body.rentalPrice === undefined ? fetchedCar.rentalPrice : req.body.rentalPrice
                }) ;
                const updatedCarResponse : CarInterface | null = await  Car.findByIdAndUpdate(req.params.id, carUpdatedObject, {new: true});
                res.status(201).json({
                    success: true,
                    message: "updated successfully!!!",
                    updatedCarResponse
                })
            }
            else{
                res.status(404).json({
                    success: false,
                    message: "car not found!!!"
                })
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "internal server error"
            })
        }
    }

    @Delete("delete/:id")
    private async deleteCar(req: Request, res: Response): Promise<void> {
        try{
            const fetchedCar: CarInterface | null = await  Car.findById(req.params.id);
            if(fetchedCar) {
                await Company.findOneAndUpdate({_id: fetchedCar.companyID}, {$pull: {cars: new Types.ObjectId(String(req.params.id))}}, {new: true})
                await Car.findByIdAndDelete(req.params.id);
                res.status(200).json({
                    success: true,
                    message: "car deleted successfully!!!"
                })
            }
            else{
                res.status(404).json({
                    success: false,
                    message: "car not found!!!"
                })
            }
        }
        catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "internal server error"
            })
        }
    }
}