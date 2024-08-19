import { makeAutoObservable } from 'mobx';
import axios from 'axios';

class Store {
    user = null;
    token = null;

    constructor() {
        makeAutoObservable(this);
        this.token = sessionStorage.getItem('token');
    }

    setUser(user) {
        this.user = user;
    }

    setToken(token) {
        this.token = token;
        sessionStorage.setItem('token', token);
    }

    clearAuth() {
        this.user = null;
        this.token = null;
        sessionStorage.removeItem('token');
    }

    isAuthenticated() {
        return true
    }
}

const store = new Store();
export default store;
