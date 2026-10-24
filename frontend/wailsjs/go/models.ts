export namespace services {
	
	export class CryptoResult {
	    privateKey?: string;
	    publicKey?: string;
	    certificate?: string;
	    p12Base64?: string;
	    info?: string;
	
	    static createFrom(source: any = {}) {
	        return new CryptoResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.privateKey = source["privateKey"];
	        this.publicKey = source["publicKey"];
	        this.certificate = source["certificate"];
	        this.p12Base64 = source["p12Base64"];
	        this.info = source["info"];
	    }
	}
	export class JWTRequest {
	    secret: string;
	    issuer?: string;
	    subject?: string;
	    audience?: string;
	    expiresIn: number;
	    notBefore?: number;
	    customClaims?: Record<string, any>;
	
	    static createFrom(source: any = {}) {
	        return new JWTRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.secret = source["secret"];
	        this.issuer = source["issuer"];
	        this.subject = source["subject"];
	        this.audience = source["audience"];
	        this.expiresIn = source["expiresIn"];
	        this.notBefore = source["notBefore"];
	        this.customClaims = source["customClaims"];
	    }
	}
	export class RequestData {
	    trustType: string;
	    format: string;
	    password: string;
	    organization: string[];
	    organizationalUnit: string[];
	    country: string[];
	    locality: string[];
	    province: string[];
	    streetAddress: string[];
	    postalCode: string[];
	    commonName: string;
	    notBefore: number;
	    notAfter: number;
	    keyUsage: number;
	    extKeyUsage: number;
	    basicConstraintsValid: number;
	    dnsNames: number;
	    ipAddresses: number;
	
	    static createFrom(source: any = {}) {
	        return new RequestData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.trustType = source["trustType"];
	        this.format = source["format"];
	        this.password = source["password"];
	        this.organization = source["organization"];
	        this.organizationalUnit = source["organizationalUnit"];
	        this.country = source["country"];
	        this.locality = source["locality"];
	        this.province = source["province"];
	        this.streetAddress = source["streetAddress"];
	        this.postalCode = source["postalCode"];
	        this.commonName = source["commonName"];
	        this.notBefore = source["notBefore"];
	        this.notAfter = source["notAfter"];
	        this.keyUsage = source["keyUsage"];
	        this.extKeyUsage = source["extKeyUsage"];
	        this.basicConstraintsValid = source["basicConstraintsValid"];
	        this.dnsNames = source["dnsNames"];
	        this.ipAddresses = source["ipAddresses"];
	    }
	}

}

