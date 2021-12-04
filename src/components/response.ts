import { builderAcceptedResponseStates } from "./blocks/builder";
import { handlerAcceptedResponseStates } from "./blocks/handler";

export type HandlerAcceptedResponseStates =
  typeof handlerAcceptedResponseStates[number];
export type BuilderAcceptedResponseStates =
  typeof builderAcceptedResponseStates[number];

export type ResponseState =
  | HandlerAcceptedResponseStates
  | BuilderAcceptedResponseStates
  | "sended";
