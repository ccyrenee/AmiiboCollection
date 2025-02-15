const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");

const jwksClient = jwksRsa({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
});

const getKey = (header, callback) => {
    jwksClient.getSigningKey(header.kid, (err, key) => {
        if (err) {
            console.error("Error fetching signing key:", err.message);
            return callback(err);
        }
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
};

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];  // Estraggo il token dopo "Bearer"
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(
        token,
        getKey,
        {
            algorithms: ["RS256"],
            issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        },
        (err, decoded) => {
            if (err) {
                console.error("Token verification error:", err.message);
                return res.status(403).json({ message: "Invalid token", error: err.message });
            }
            req.user = decoded;
            next();
        }
    );
};

module.exports = authMiddleware;
