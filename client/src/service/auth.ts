const Auth = {
  login(credentials) {
    return fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }).then((res) => {
      if (!res.ok) {
        throw Error(res.statusText);
      } else {
        return res.json();
      }
    });
  },
};

export default Auth;
