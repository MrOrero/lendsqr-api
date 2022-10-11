import bcrypt from "bcryptjs";

export const hashPassword = async (password: string, salt: number) => {
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
) => {
    return await bcrypt.compare(password, hashedPassword);
};
