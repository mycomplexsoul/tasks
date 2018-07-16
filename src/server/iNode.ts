// import { IncomingMessage, ServerResponse } from "http";
import { Request, Response } from "express";

export interface iNode {
    request: Request
    , response: Response
 }