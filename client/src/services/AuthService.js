export const getUser = () => {
  try {
    const auth = JSON.parse(window.localStorage.getItem("movie.auth"));
    if (auth) {
      const [, payload] = auth.access.split(".");
      const decoded = window.atob(payload);
      return JSON.parse(decoded);
    }
    return {};
  } catch (error) {
    return { error: error.message };
  }
};

export const getAccessToken = () => {
  try {
    const auth = JSON.parse(window.localStorage.getItem("movie.auth"));
    if (auth) {
      return auth.access;
    }
    return "";
  } catch (error) {
    return { error: error.message };
  }
};
