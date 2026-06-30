export const login = async (email, password) => {

    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        return data;

    } catch (error) {

        console.error(error);

        return {
            ok: false,
            message: "No fue posible conectar con el servidor."
        };

    }

};