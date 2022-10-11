import IWalletDetails from "../interfaces/wallet-details";

const formatWalletDetails = (walletDetails: IWalletDetails[]) => {
    const result = walletDetails.map((wallet) => {
        return {
            walletNumber: wallet.wallet_number,
            walletBalance: wallet.balance,
            wallet: wallet.user.map((wallet) => {
                return {
                    firstName: wallet.first_name,
                    lastName: wallet.last_name,
                    email: wallet.email,
                };
            }),
        };
    });
    return result;
};

export default formatWalletDetails;
