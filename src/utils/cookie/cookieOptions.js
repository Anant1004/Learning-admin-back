export const cookieOptions = {
    httpOnly: true, // javascript k though koi acess nahi kar sakta hai 
    secure: process.env.NODE_ENV === "production", // https in production
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour me expire ho jayega
  };