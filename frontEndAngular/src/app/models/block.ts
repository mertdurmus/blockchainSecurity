import { transaction } from './transaction';

// tslint:disable-next-line:class-name
export class block {
index: number;
transactions: transaction [];
timestamp: Date;
previous_hash: string;
nonce: number;
hash: string;
}