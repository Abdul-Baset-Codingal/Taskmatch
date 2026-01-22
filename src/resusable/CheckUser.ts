/* eslint-disable @typescript-eslint/no-unused-vars */
// utils/auth.js
export const checkLoginStatus = async () => {
    try {
        const response = await fetch(
            `/api/auth/verify-token`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const text = await response.text();
      //  console.log("Verify token response:", text);

        if (response.ok) {
            const data = JSON.parse(text);
         //   console.log("Parsed user data:", data);

            // ✅ Return whole user object
            return { isLoggedIn: true, user: data.user };
        } else {
          //  console.error("Verify token failed:", response.status, text);
            return { isLoggedIn: false, user: null };
        }
    } catch (error) {
       // console.error("Error checking login status:", error);
        return { isLoggedIn: false, user: null };
    }
};
