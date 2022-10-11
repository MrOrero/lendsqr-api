import jwt from "jsonwebtoken";

const signToken = (email: String, userId: String) => {
    return jwt.sign({ email, userId }, "secrettokenkey", { expiresIn: "1h" });
};

export default signToken;
