const authenticate = (event) => {
    try {
        const authHeader = event.headers?.Authorization || event.headers?.authorization;
        
        if (!authHeader) {
            return { error: 'Authorization header is required' };
        }

        if (!authHeader.startsWith('Bearer ')) {
            return { error: 'Authorization header must start with Bearer' };
        }

        const token = authHeader.substring(7);
        
        if (!token) {
            return { error: 'Token is required' };
        }

        // Simple token validation - just check if token exists
        // In production, you would verify JWT signature
        if (token.length < 10) {
            return { error: 'Invalid token' };
        }

        return { user: { token } };
    } catch (error) {
        return { error: 'Invalid or expired token' };
    }
};

module.exports = { authenticate };