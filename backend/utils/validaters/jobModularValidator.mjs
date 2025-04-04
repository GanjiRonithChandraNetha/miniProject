import jobCredentialChecker from "./jobValidator.mjs";

const jobModularChecker = (field, value) => {
    const schema = jobCredentialChecker.shape[field];
    if (!schema) {
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