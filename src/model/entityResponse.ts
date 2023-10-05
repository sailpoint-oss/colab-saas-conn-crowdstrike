export class EntityResponse {

    primaryDisplayName?: string;
    secondaryDisplayName?: string;
    isHuman?: boolean;
    isProgrammatic?: boolean;
    emailAddresses?: Array<string>;
    roles?: Array<Role>;
    riskScore?: number;
    riskScoreSeverity?: string;
    riskFactors?: Array<RiskFactor>;
}

class Role {
    
    type?: string
}

class RiskFactor {
    type?: string;
    severity?: string
}