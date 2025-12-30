export const auth = {
  isLoggedIn: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user") !== null;
    }
    return false;
  },

  getUser: () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  login: (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    if (email && password) {
      const user = { email, id: Date.now() };
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    }
    return false;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  },

  signup: (fullName: string, email: string, password: string) => {
    // Mock signup
    if (fullName && email && password) {
      const user = { fullName, email, id: Date.now() };
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    }
    return false;
  },
};
