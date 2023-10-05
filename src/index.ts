import {
    Context,
    createConnector,
    readConfig,
    Response,
    logger,
    StdAccountListOutput,
    StdAccountReadInput,
    StdAccountReadOutput,
    StdTestConnectionOutput,
} from '@sailpoint/connector-sdk'
import {CrowdstrikeClient} from './crowdstrike-client'
import {Util} from "./util"

// Connector must be exported as module property named connector
export const connector = async () => {

    // Get connector source config
    const config = await readConfig()

    // Use the vendor SDK, or implement own client as necessary, to initialize a client
    const crowdstrikeClient = new CrowdstrikeClient(config);

    const util = new Util();

    return createConnector()
        .stdTestConnection(async (context: Context, input: undefined, res: Response<StdTestConnectionOutput>) => {
            logger.info("Running test connection");
            res.send(await crowdstrikeClient.testConnection())
        })
        
        .stdAccountList(async (context: Context, input: undefined, res: Response<StdAccountListOutput>) => {
            console.log('listing accounts');
            const users = await crowdstrikeClient.getAllUsers();
            for (const user of users) {
                res.send(util.userToAccount(user))
            }
            })
}
