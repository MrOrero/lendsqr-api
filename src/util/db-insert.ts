import conn from "../database";

export const insert = async (user: string, data: {}) => {
    const result: number[] = await conn(user).insert({
        ...data,
    });
    return result;
};
