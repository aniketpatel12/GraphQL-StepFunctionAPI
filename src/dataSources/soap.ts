import easySoap from 'easy-soap-request';
import { parseString } from 'xml2js';
import fs from 'fs';

class SoapSource {
	constructor(
		private readonly url: string,
		private readonly headers: { [key: string]: string },
		private readonly xml: string,
		private readonly timeout: number
	) {}

	public static readXmlFromFile(path: string): string {
		return fs.readFileSync(path, 'utf-8');
	}

	public async sendRequest(): Promise<string> {
		try {
			const options = {
				url: this.url,
				headers: this.headers,
				xml: this.xml,
				timeout: this.timeout,
			};

			const { response } = await easySoap(options);
			const result = await this.parseXmlResponse(response.body);
			return result;
		} catch (error) {
			throw error;
		}
	}

	private getParsedResultOfNumberToWord(result: any): string {
		return result['soap:Envelope']['soap:Body'][0][
			'm:NumberToWordsResponse'
		][0]['m:NumberToWordsResult'][0];
	}

	private parseXmlResponse(xmlResponse: string): Promise<string> {
		return new Promise((resolve, reject) => {
			parseString(xmlResponse, (err, result) => {
				if (err) {
					reject(err);
				} else {
					const numberToWordsResult =
						this.getParsedResultOfNumberToWord(result);
					resolve(numberToWordsResult);
				}
			});
		});
	}
}

// For testing
const xml = SoapSource.readXmlFromFile('src/envelopes/NumberToWords.xml');

const headers: { [key: string]: string } = {
	'Content-Type': 'text/xml;charset=UTF-8',
	'Accept-Encoding': 'gzip,deflate',
	'Content-Length': xml.length.toString(),
};

const url = 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso';
const timeout = 10000;

const soap = new SoapSource(url, headers, xml, timeout);
soap.sendRequest()
	.then((result: string) => {
		console.log('Result:', result);
	})
	.catch((error) => {
		console.error(error);
	});
