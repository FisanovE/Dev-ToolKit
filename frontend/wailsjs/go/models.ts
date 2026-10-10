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

}

