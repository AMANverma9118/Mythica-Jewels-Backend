import axios from "axios";

export const verifyRecaptcha = async (req, res, next) => {

    // if (process.env.NODE_ENV === 'development') return next();

    const {recaptchaToken} = req.body;
    if (!recaptchaToken) {
        return res.status(400).json({ message: "Recaptcha token is missing" });
    }

    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`);
        const data = response.data; 
        if (!data.success || data.score < 0.5) {
            return res.status(403).json({ message: "Recaptcha verification failed" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Recaptcha verification error", error: error.message });
    }
};