import bcrypt from "bcryptjs";

const salt: number = parseInt(<string>process.env.SALT);

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
) => {
    return await bcrypt.compare(password, hashedPassword);
};
