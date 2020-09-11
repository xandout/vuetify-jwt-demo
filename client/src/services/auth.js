import Axios from 'axios'
const baseUrl = "/api/v1"
Axios.defaults.baseURL = baseUrl
export default {
    login(email, pass, cb) {
        cb = arguments[arguments.length - 1]
        if (localStorage.token) {
            if (cb) cb(true)
            this.onChange(true)
            return
        }
        Axios.post("/login", { email: email, password: pass })
            .then(res => {
                if (res.data.status == 200) {
                    localStorage.setItem('token', res.data.token)
                    cb(true)
                    this.onChange(true)
                } else {
                    cb(false)
                    this.onChange(false)
                }
            })
            .catch(err => {
                cb(false)
                this.onChange(false)
                console.log(err)
                return
            })
    },
    register(email, pass, first, last, cb) {
        cb = arguments[arguments.length - 1]
        if (localStorage.token) {
            if (cb) cb(true)
            this.onChange(true)
            return
        }
        Axios.post('/register', {
            email: email,
            password: pass,
            first_name: first,
            last_name: last
        }).then(res => {
            if (res.data.status == 201) {
                this.login(email, pass, loggedIn => {
                    // logged the new user in
                    cb(loggedIn)
                    this.onChange(loggedIn)
                    return
                })
            }
        }).catch(err => {
            console.log(err)
            cb(false)
            this.onChange(false)
        })
    },
    getToken() {
        return localStorage.token
    },
    logout(cb) {
        delete localStorage.token
        if (cb) cb()
        this.onChange(false)
    },
    loggedIn() {
        return !!localStorage.token
    },
    whoAmI(cb) {
        let config = {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        }
        Axios.get('/whoami', config)
            .then(res => {
                cb(res.data)
            })
            .catch(resErr => {
                cb(resErr)
            })
    },
    onChange() { }
}
