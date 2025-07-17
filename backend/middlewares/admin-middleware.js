 const adminMiddleware = async(req, res, next) => {
    try {
        
        const adminRole = req.user.isAdmin;
        if(!adminRole){
            return res.status(403).json({message:"Access Denied. User is not admin"})
        }
        // if user is admin, then proced to the next middleware
        next();
    } catch (error) {
        next(error);
    }
 }

 module.exports = adminMiddleware;