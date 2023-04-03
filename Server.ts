import { Server } from "@overnightjs/core";
import dotenv from "dotenv";
import { connect } from "./utils/database";
import bodyParser from "body-parser";
import { CompanyController } from "./controllers/Company";
import { CarController } from "./controllers/car";

dotenv.config();
class MyServer extends Server {
    private readonly PORT = 5000;
    constructor() {
        super();
        this.setupExpress();
        this.setupControllers();
    }

    private setupControllers() : void {
        const companyController = new CompanyController();
        const carController = new CarController()
        this.addControllers([companyController, carController])
    }
    private setupExpress(): void{
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}))
    }
    public start(): void {
        connect().then( ()=> {
            this.app.listen(this.PORT, () => {
                console.log(`Server is listening on port: ${this.PORT}`);
            })
        })
    }
}

export  default  MyServer;