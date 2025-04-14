import { object,string,number,array, date,enum as zEnum } from "zod";

const jobInput = object({
    title:string(),
    description:string(),
    skills:array(string()),
    budget:number(),
    deadline:date(),
    status:zEnum(["ongoing","vacant","completed"]),
    createdAt:date().optional(),
    image:string().url("invalid url provided").optional(),
    imageRatio:string().regex(/[^\d+:\d+$]/,"enter approprieate dimentions").optional()
})
const jobCredentialChecker = obj=>jobInput.safeParse(obj)
export default jobCredentialChecker;
export {jobInput};