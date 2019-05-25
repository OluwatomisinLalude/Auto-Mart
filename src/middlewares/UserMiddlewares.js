class UserMiddlewares {
    static validateUsername (req, res, next) {
        const { userName } = req.body;
        const regex = /\d+/;
        if (regex.test(userName)) {
            return res.status(400).json({
                success: false,
                message: "You cannot use digits in your username",
            });
        }
        return next();
    }
}

export default UserMiddlewares;
