import IUser from "../interfaces/user";

export default interface IWalletDetails {
    id: number;
    balance: number;
    wallet_number: string;
    pin: string;
    user_id: number;
    user: IUser[];
}
