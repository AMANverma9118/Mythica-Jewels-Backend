import axios from "axios";

export const verifyRecaptcha = async (req, res, next) => {

  if (process.env.NODE_ENV !== "production") {
    return next();
  }

  const { recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ message: "Recaptcha token is missing" });
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", recaptchaToken);

    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      params
    );

    const data = response.data;

    if (!data.success) {
      return res.status(403).json({ message: "Recaptcha verification failed" });
    }

    if (data.score < 0.5) {
      return res.status(403).json({ message: "Low recaptcha score" });
    }

    if (data.action && !["signin", "signup"].includes(data.action)) {
      return res.status(403).json({ message: "Invalid recaptcha action" });
    }

    next();
  } catch (error) {
    console.error("Recaptcha error:", error.message);
    return res.status(500).json({
      message: "Recaptcha verification error",
      error: error.message,
    });
  }
};
