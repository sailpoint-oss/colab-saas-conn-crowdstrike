import {Config} from "./model/config";
import axios, {AxiosResponse} from "axios";
import qs from "qs";
import {ConnectorError, logger, StdTestConnectionOutput} from "@sailpoint/connector-sdk";

const tokenAPI = "https://api.crowdstrike.com/oauth2/token";
let accessToken: AxiosResponse<String> | void;

export class CrowdstrikeClient {
    private readonly clientId?: string;
    private readonly clientSecret?: string;

    constructor(config: Config) {
        // Fetch necessary properties from config.
        this.clientId = config.clientId;
        if (this.clientId == null) {
            throw new Error('client id must be provided from config')
        }

        this.clientSecret = config.clientSecret;
        if (this.clientSecret == null) {
            throw new Error('client secret must be provided from config')
        }
    }

    async testConnection(): Promise<StdTestConnectionOutput> {
        logger.info("In Test Connection- Crowdstrike client");
        accessToken = await getToken(tokenAPI, this.clientId, this.clientSecret);
        if (!accessToken) {
            throw new ConnectorError("Unable to connect to Crowdstrike")
        }
        return {}
    }

    async getAllUsers() {
        accessToken = await getToken(tokenAPI, this.clientId, this.clientSecret);
        console.log("Result is" + accessToken);

        var data = JSON.stringify({
            query: `{
  # Query "Entities":
  entities (   
    minRiskScoreSeverity: MEDIUM,
    # Sort the results in ascending primary display name order:
    sortKey: PRIMARY_DISPLAY_NAME
    sortOrder: ASCENDING
    # Limit the response to the first five records:
    first: 1000
  )
  {
    # Use "nodes" keyword when expecting multiple matching entities:
    nodes {
      # Requested fields:
      primaryDisplayName
      secondaryDisplayName
      isHuman: hasRole(type: HumanUserAccountRole)
       isProgrammatic: hasRole(type: ProgrammaticUserAccountRole)
       ... on UserEntity
       {
         emailAddresses
            }
      roles
      {
        type
      }
      riskScore
      riskScoreSeverity
      riskFactors
       {
         type
         severity
       }
       
    }
  }
}`,
            variables: {}
        });

        var config = {
            method: 'post',
            url: 'https://api.crowdstrike.com/identity-protection/combined/graphql/v1',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios(config)
            .then(response =>
                response.data['data']['entities']['nodes']
            )
            .catch(function (error: any) {
                console.log(error);
            });
    }
}

async function getToken(tokenAPI: string, clientId: string | undefined, clientSecret: string | undefined) {
    console.log("Entering getToken()");

    const data = qs.stringify({
        'grant_type': 'client_credentials',
        'client_id': clientId,
        'client_secret': clientSecret
    });
    const config = {
        method: 'post',
        url: tokenAPI,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    return axios(config)
        .then(response =>
            response.data['access_token']
        )
        .catch(function (error: any) {
            console.log(error);
        });
}




