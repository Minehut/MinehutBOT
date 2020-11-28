import { mongoose } from '@typegoose/typegoose';
import { readFile } from 'fs';
import * as XLSX from 'xlsx';
import { BoosterPass, BoosterPassModel } from './model/boosterPass';

require('dotenv').config();

interface BoosterPassDocument {
	'Nitro Booster': string;
	'Booster ID': string;
	'Pass #1': string;
	'Pass #1 ID': string;
	'Pass #2': string;
	'Pass #2 ID': string;
}

(async () => {
	await mongoose.connect(process.env.MONGO_URI || '', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	readFile('boosters.xlsx', (err, data) => {
		if (err) return new Error(`Cannot read boosters document -- ${err}`);
		const workbook = XLSX.read(data, { type: 'buffer' });
		const sheetNameList = workbook.SheetNames;
		const sheetToJson: BoosterPassDocument[] = XLSX.utils.sheet_to_json(
			workbook.Sheets[sheetNameList[0]]
		);

		sheetToJson.forEach(async doc => {
			const granterId = doc['Booster ID'];
			const granterTag = doc['Nitro Booster'];

			if (granterId && granterTag) {
				if (doc['Pass #1']) {
					const grantedId = doc['Pass #1 ID'];
					const grantedTag = doc['Pass #1'];
					if (grantedId && grantedTag) {
						const boosterPass: BoosterPass = {
							granterId,
							granterTag,
							grantedId,
							grantedTag,
							guild: '239599059415859200',
						};
						BoosterPassModel.create(boosterPass);
					}
				}

				if (doc['Pass #2']) {
					const grantedId = doc['Pass #2 ID'];
					const grantedTag = doc['Pass #2'];
					if (grantedId && grantedTag) {
						const boosterPass: BoosterPass = {
							granterId,
							granterTag,
							grantedId,
							grantedTag,
							guild: '239599059415859200',
						};
						BoosterPassModel.create(boosterPass);
					}
				}
			}
			console.log(`Inserted doc with granter tag ${granterTag} to Mongo`);
		});
	});
})();