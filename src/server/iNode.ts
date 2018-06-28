import { IncomingMessage, ServerResponse } from "http";

export interface iNode {
    request: IncomingMessage
    , response: ServerResponse
    , mysql: any
    , connection: any
    , data: any
}