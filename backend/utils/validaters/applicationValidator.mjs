import { number, object,string,enum as Zenum } from "zod";

const applicationChecker = object({
    bidAmount:number().min(0),
    coverLetter:string(),
    status:Zenum(["draft","published","appointed","rejected"])
})

const applicationModularChecker = (field,value)=>{
    const schema = applicationChecker.shape[field];
    if(!schema){
        return {
            sucess:false,
            erro:'Invalid field'
        }
    }
    const result = schema.safeParse(value);
    if (!result.success) {
        return {
            success: false,
            error: result.error.errors
        };
    }
    return {
        success: true,
        data: result.data
    };
}

export {applicationChecker, applicationModularChecker};