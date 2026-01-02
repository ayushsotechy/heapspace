
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./prisma";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            callbackURL: "http://localhost:4444/api/auth/google/callback",
            scope: ["profile", "email"],
        },
        async(accessToken, refreshToken, profile, done) => {
            try{
                const existingUser = await prisma.user.findUnique({
                    where: {googleId:profile.id},
                });
                if(existingUser){
                    return done(null,existingUser);
                }

                const existingEmailUser = await prisma.user.findUnique({
                    where:{email:profile.emails?.[0].value },
                });
                if(existingEmailUser){
                    const updatedUser = await prisma.user.update({
                        where:{id:existingEmailUser.id},
                        data:{googleId:profile.id}
                    });
                    return done(null,updatedUser);
                }

                //create a new user
                const newUser = await prisma.user.create({
                    data:{
                        username: profile.displayName.replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 1000),
                        email: profile.emails?.[0].value || "",
                        googleId: profile.id,
                    },
                });
                return done(null,newUser);
            }catch(error){
                return done(error,false);
            }
        }
    )
)
export default passport;