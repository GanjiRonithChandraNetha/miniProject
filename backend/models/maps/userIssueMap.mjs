import { Schema,model } from "mongoose";

const userIssuesMaps = Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'users'
    },
    issuesId:{
        type: Schema.Types.ObjectId,
        ref:'issues'
    }
});

const userIssuesModel = model(userIssuesMaps,'userIssuesMaps');

export default userIssuesModel