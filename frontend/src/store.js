import { makeAutoObservable } from 'mobx';
import axios from 'axios';

class Store {
    user = null;
    accessToken = null;
    refreshToken = null;

    constructor() {
        makeAutoObservable(this);
        this.token = sessionStorage.getItem('token');
    }

    setUser(user) {
        this.user = user;
    }

    setAccessToken(token) {
        this.accessToken = token;
        sessionStorage.setItem('token', token);
    }

    setRefreshToken(token) {
        this.refreshToken = token;
    }

    clearAuth() {
        this.user = null;
        this.accessToken = null;
        this.refreshToken = null;
        sessionStorage.removeItem('token');
    }

    async isAuthenticated() {
        try {
            const response = await axios.get('http://localhost:8000/api/is_authenticated/', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}

const store = new Store();
export default store;
