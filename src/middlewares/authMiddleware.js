export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).send('Access denied. Admins only.');
};

export const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    }
    return res.status(403).send('Access denied. Users only.');
};

export const isAdminOrUser = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'user')) {
        return next();
    }
    return res.status(403).send('Access denied.');
};

export default isAdmin;
