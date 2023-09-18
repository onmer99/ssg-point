import { userInputProfileType } from "@/app/signup/layout";
import { createContext } from "react";

export const UserContext = createContext<userInputProfileType>({} as userInputProfileType);