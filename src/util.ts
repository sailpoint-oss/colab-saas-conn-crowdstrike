import { StdAccountCreateOutput} from "@sailpoint/connector-sdk";
import {EntityResponse} from "./model/entityResponse";


export class Util {

    /**
     * converts user object to IDN account output
     *
     * @param {EntityResponse} EntityResponse object
     * @returns {StdAccountCreateOutput} IDN account create object
     */
    public userToAccount(entityResponse: EntityResponse): StdAccountCreateOutput {
        return {
            // Convert id to string because IDN doesn't work well with number types for the account ID
            identity: entityResponse.primaryDisplayName ? entityResponse.primaryDisplayName : '',
            uuid: getDisplayName(entityResponse.secondaryDisplayName),
            attributes: {
                username: getDisplayName(entityResponse.primaryDisplayName),
                id: entityResponse.primaryDisplayName ? entityResponse.primaryDisplayName : '',
                email: entityResponse.emailAddresses? entityResponse.emailAddresses: '',
                isHuman: entityResponse.isHuman ? entityResponse.isHuman : false,
                isProgrammatic: entityResponse.isProgrammatic ? entityResponse.isProgrammatic : false,
                riskScore: entityResponse.riskScore ? entityResponse.riskScore : 0,
                riskScoreSeverity: entityResponse.riskScoreSeverity ? entityResponse.riskScoreSeverity : '',
            }
        }
    }
}

function getDisplayName(displayName: any): string {
    const originalUserName = displayName.toLowerCase();
    const newUserName = originalUserName + '.' + originalUserName;
    console.log(newUserName);

    return newUserName;

}
