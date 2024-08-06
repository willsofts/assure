const getPrimes = function (min, max) {
	const result = Array(max + 1).fill(0).map((_, i) => i);
	for (let i = 2; i <= Math.sqrt(max + 1); i++) {
	    for (let j = i ** 2; j < max + 1; j += i) delete result[j];
	}
	return Object.values(result.slice(min));
};
	
const getRandomNum = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
	
const getRandomPrime =function (min, max) {
	const primes = getPrimes(min, max);
	return primes[getRandomNum(0, primes.length - 1)];
};
	
const getPrimeNumber = function() {
	return getRandomPrime(1000,10000);
};
	
function DH() {
	this.prime = ""+getPrimeNumber();
	this.generator = ""+getPrimeNumber();
	this.privateKey = ""+getPrimeNumber();
	this.publicKey = ""+getPrimeNumber();
	this.sharedKey = ""+getPrimeNumber();
	this.otherPublicKey = ""+getPrimeNumber();
}

DH.prototype.encryptText = function(word,keyBase64) {
	let key = CryptoJS.enc.Base64.parse(keyBase64);
	let srcs = CryptoJS.enc.Utf8.parse(word);
	let encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
	return encrypted.toString();
};

DH.prototype.decryptText = function(word,keyBase64) {
	let key = CryptoJS.enc.Base64.parse(keyBase64);
	let decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
	return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};

DH.prototype.encrypt = function(word) {
	let hash = CryptoJS.SHA256(this.sharedKey);
	let keyBase64 = hash.toString(CryptoJS.enc.Base64);
	let key = CryptoJS.enc.Base64.parse(keyBase64);
	let srcs = CryptoJS.enc.Utf8.parse(word);
	let encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
	return encrypted.toString();
};

DH.prototype.decrypt = function(word) {
	let hash = CryptoJS.SHA256(this.sharedKey);
	let keyBase64 = hash.toString(CryptoJS.enc.Base64);
	let key = CryptoJS.enc.Base64.parse(keyBase64);
	let decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
	return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};
	
DH.prototype.computePublicKey = function() {	
	let G = new BigInteger(this.generator);
	let P = new BigInteger(this.prime);
	let a = new BigInteger(this.privateKey);
	let ap = G.modPowInt(a, P);
	this.publicKey = ap.toString();
};

DH.prototype.computeSharedKey = function() {
	let P = new BigInteger(this.prime);
	let a = new BigInteger(this.privateKey);
	let bp = new BigInteger(this.otherPublicKey);		
	let ashare = bp.modPowInt(a, P);
	this.sharedKey = ashare.toString();
};
	
DH.prototype.compute = function() {
	this.computePublicKey();
	this.computeSharedKey();
};
	
DH.prototype.requestGenerator = function(callback,aurl) {
	this.requestPublicKey(this,callback,aurl);
};

DH.prototype.getAccessorInfo = function() {
	return getAccessorInfo();
};

DH.prototype.getAccessorToken = function() {
	let json = this.getAccessorInfo();
	if(json && json.authtoken) {
		return json.authtoken;
	}
	return "";
};
	
DH.prototype.requestPublicKey = function(dh,callback,aurl) {
	if(!aurl) aurl = "/api/crypto/dh";
	let authtoken = this.getAccessorToken();
	jQuery.ajax({
		url: aurl,
		type: "POST",
		dataType: "json",
		headers : { "authtoken": authtoken },
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		error : function(transport,status,errorThrown) {
			console.log(errorThrown);
			if(callback) callback(false,errorThrown);
		},
		success: function(data,status,transport){
			console.log(transport.responseText);
			if(dh && data.body.info) {
				let info = data.body.info;
				dh.prime = info.prime;
				dh.generator = info.generator;
				dh.otherPublicKey = info.publickey;
				dh.compute();
				dh.submitPublicKey();
			}	
			if(callback) callback(true,data,transport);
		}
	});	
};
	
DH.prototype.submitPublicKey = function(callback,aurl) {
	if(!aurl) aurl = "/api/crypto/dh";
	let authtoken = this.getAccessorToken();
	jQuery.ajax({
		url: aurl,
		type: "POST",
		data: {
			publickey: this.publicKey
		},
		dataType: "json",
		headers : { "authtoken": authtoken },
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		error : function(transport,status,errorThrown) {
			console.log(errorThrown);
			if(callback) callback(false,errorThrown);
		},
		success: function(data,status,transport){
			console.log(transport.responseText);
			if(callback) callback(true,transport);
		}
	});		
};

DH.prototype.updatePublicKey = function(callback,aurl) {
	if(!aurl) aurl = "/api/crypto/update";
	let authtoken = this.getAccessorToken();
	jQuery.ajax({
		url: aurl,
		type: "POST",
		data: {
			publickey: this.publicKey
		},
		dataType: "json",
		headers : { "authtoken": authtoken },
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		error : function(transport,status,errorThrown) {
			console.log(errorThrown);
			if(callback) callback(false,errorThrown);
		},
		success: function(data,status,transport){
			console.log(transport.responseText);
			if(callback) callback(true,transport);
		}
	});		
};
