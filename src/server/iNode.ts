// import { IncomingMessage, ServerResponse } from "http";
import { Request, Response } from "../../node_modules/@types/express";

export interface iNode {
    request: Request
    , response: Response
 }