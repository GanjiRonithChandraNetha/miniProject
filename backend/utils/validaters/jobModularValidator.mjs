import {jobInput} from "./jobValidator.mjs";

const jobModularChecker = (field, value) => {
    const schema = jobInput.shape[field];
    if (!schema || field == 'createdAt') {
        return {
            success: false,
            error: "Invalid field"
        };
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
};

export default jobModularChecker;