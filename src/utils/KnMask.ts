export class KnMask {
    public maskChar = "*";
    
    constructor(maskChar = "*") {
        this.maskChar = maskChar;
    }

	/**
	 * @param text The number in plain text
	 * @param mask The mask pattern. 
	 *    Use # to include the digit from the position. 
	 *    Use x or * to mask the digit at that position.
	 *    Any other char will be inserted.
	 *
	 * @return The masked string
	 */
	public static maskingNumber(text?: string, mask: string = "####-xxxx-####", maskChar: string = "*") : string {		 
		let masked : string = "";
		if(text && text.trim().length > 0) {
			let index = 0;
			let length = text.length;
			for (let i = 0; i < mask.length; i++) {
				let c = mask.charAt(i);
				if (c == '#') {
					if(index<length) {
						masked = masked.concat(text.charAt(index));
					}
					index++;
				} else if (c == 'x' || c == 'X' || c == maskChar) {
					masked = masked.concat(c);
					index++;
				} else {
					masked = masked.concat(c);
				}
			}
		}
		return masked;
	}	
    
	/**
	 * @param text The number in plain text
	 * @param maskLength number of remaining original text
	 * @param maskChar default is "*" to be masked
	 * @return The masked string
	 * ex. text = "1234567898765432"
	 * after maskingHead(text,4) = ************5432
	 * mask head but last 4 characters remain
	 */
	public static maskingHead(text?: string, maskLength: number = 4, maskChar: string = "*") : string {
		let masked : string = "";
		if(text && text.trim().length > 0) {
			let length = text.length;
			let maskPoint = length - maskLength;
			for (let i = 0; i < length; i++) {
				let c = text.charAt(i);
				if(i >= maskPoint) {
					masked = masked.concat(c);
				} else {
					masked = masked.concat(maskChar);
				}
			}
		}
		return masked;
	}
    
	/**
	 * @param text The number in plain text
	 * @param maskLength number of remaining original text
	 * @param maskChar default is "*" to be masked
	 * @return The masked string
	 * ex. text = "1234567898765432"
	 * after maskingTail(text,4) = 1234************
	 * mask tail (until end of string) but first 4 characters remain
	 */
	public static maskingTail(text?: string, maskLength: number = 4, maskChar: string = "*") : string {
		let masked : string = "";
		if(text && text.trim().length > 0) {
			let length = text.length;
			for (let i = 0; i < length; i++) {
				let c = text.charAt(i);
				if(i >= maskLength) {
					masked = masked.concat(maskChar);
				} else {
					masked = masked.concat(c);
				}
			}
		}
		return masked;
	}

	/**
	 * @param text The number in plain text
	 * @param maskLength number of remaining original text
	 * @param maskChar default is "*" to be masked
	 * @return The masked string
	 * ex. text = "1234567898765432"
	 * after maskingHeadAndTail(text,4) = 1234********5432
	 * mask head and tail (until end of string) but first & last 4 characters remain
	 */
    public static maskingHeadAndTail(text?: string, maskLength: number = 4, maskChar: string = "*") : string {
		let masked : string = "";
		if(text && text.trim().length > 0) {
			let length = text.length;
			let maskPoint = length - maskLength;
			for (let i = 0; i < length; i++) {
				let c = text.charAt(i);
				if(i >= maskPoint) {
					masked = masked.concat(c);
				} else {
					if(i >= maskLength) {
						masked = masked.concat(maskChar);
					} else {
						masked = masked.concat(c);
					}	
				}
			}
		}
		return masked;
	}

	public maskHead(text?: string, maskLength: number = 4) : string {
		return KnMask.maskingHead(text, maskLength, this.maskChar);
	}
	
	public maskNumber(text?: string, mask: string = "####-xxxx-####") {
		return KnMask.maskingNumber(text, mask, this.maskChar);
	}

	public maskTail(text?: string, maskLength: number = 4) {
		return KnMask.maskingTail(text, maskLength, this.maskChar);
	}

    public maskHeadAndTail(text?: string, maskLength: number = 4) : string {
        return KnMask.maskingHeadAndTail(text, maskLength, this.maskChar);
    }

}
