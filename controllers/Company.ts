import { Request, Response } from "express"
import { Controller, Get, Post, Put, Delete } from "@overnightjs/core"
import { Company } from "../models/Company";
import { Car } from "../models/Cars";
import { CompanyInterface } from "../interfaces/Compnay.interface"



@Controller("api/company")
export class CompanyController {
    @Post("register")
    private async register(req: Request, res: Response): Promise<void> {
        console.log(req.body)
        try{
            const company = new Company({
                name: req.body.name,
                email: req.body.email
            });
            const response = await  company.save();
            console.log(response)
            res.status(201).json({success: true,response})
        }
        catch(err){
            res.status(500).json({
                success: false,
                message: err
            })
        }
    }
    @Get("getCompany/:id")
    private async getCompany (req: Request, res: Response): Promise<void> {
        try{
            const fetchedCompany: CompanyInterface | null = await  Company.findById(req.params.id);
            if(fetchedCompany){
                res.status(200).json({
                    success: true,
                    fetchedCompany
                })
            }
        }
        catch(err){
            res.status(500).json("internal server error");
        }
    }
    @Put("update/:id")
    private async updateCompany(req: Request, res: Response) : Promise<void> {
        try{
            const fetchedCompany: CompanyInterface | null = await Company.findById(req.params.id);
            if(fetchedCompany){
                const updateObject: CompanyInterface | null = {
                    name: req.body.name === undefined ? fetchedCompany.name : req.body.name,
                    email: req.body.email === undefined ? fetchedCompany.email : req.body.email
                };
                const updatedObject: CompanyInterface | null = await  Company.findByIdAndUpdate(req.params.id, updateObject, {new : true} );
                res.status(201).json({
                    success: true,
                    message: "updated successfully!!!",
                    updatedObject
                })
            }
        }

        catch(err){
            console.error(err)
            res.status(500).json("internal server error");
        }
    }
    @Delete("delete/:id")
    private async deleteCompany (req: Request, res: Response) :Promise<void> {
        try{
            const fetchCompany: CompanyInterface | null = await Company.findById(req.params.id);
            if(fetchCompany){
                if(fetchCompany.cars!.length){
                    await Car.deleteMany({_id: {$in: fetchCompany.cars}})
                }
                await Company.findByIdAndDelete(req.params.id);
                res.status(200).json({
                    success: true,
                    message: "company deleted successfully!!!"
                })
            }
            else{
                res.status(404).json({
                    success: false,
                    message: "company not found!!!"
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
}


