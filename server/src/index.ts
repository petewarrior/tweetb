import { Server } from "./Server";
import * as dotenv from "dotenv";

dotenv.config();

const server = Server.bootstrap();