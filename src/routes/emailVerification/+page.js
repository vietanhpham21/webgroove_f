export async function load({ url }) {
    const token = url.searchParams.get('token');
    const email = url.searchParams.get('email');
    let success

    if (!token || !email) {
        return {status: 'invalid'};
    }

    try {
        const response = await fetch(`http://localhost:3999/api/user/verify?token=${token}&email=${email}`);
        const data = await response.json();
        if (data.success) {
            console.log(data)
            return {status: "success"};
        } else {
            console.log("fehler beim fetch", data)
            return {status: "false"};
        }
    } catch (error) {
        console.error('Error:', error);
        return {status:'invalid'};
    }

}
