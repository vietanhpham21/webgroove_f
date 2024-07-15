import { fail } from "@sveltejs/kit";

// Diese Datei wird nicht mehr benutzt
//
//
//
let result = null

export const actions = {
    async create({ request }) {
        const formData = await request.formData();
        const userData = {
            username: formData.get('username'),
            password: formData.get('password1'),
            password2: formData.get('password2'),
            email: formData.get('email'),
            country: formData.get('country'),
            // profilePic: data.get('profilePic')
        };


        if (userData.password !== userData.password2) {
            return fail(422, {
                error: 'Passwörter stimmen nicht überein'
            });
        }

        try {
            const response = await fetch('https://webgroove-82906d5c43b2.herokuapp.com/api/user', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userData.email,
                    username: userData.username,
                    password: userData.password
                })
            });
            console.log([...formData])
            const data = await response.json();

            if (response.ok) {
                // Erfolgreiche Antwort verarbeiten, z.B. Weiterleitung oder Anzeige einer Erfolgsmeldung
                console.log('Benutzer erfolgreich erstellt');
                return{success: true}
            } else {
                // Fehlerhafte Antwort verarbeiten
                console.error('Fehler beim Erstellen des Benutzers:', response.statusText, data.errors);
                return fail(422, {
                    error: 'Passwort ist nicht stark genug'
                });            }

            // handle successful response
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            // handle error
        }

        // return userData;
    }
}
