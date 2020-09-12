import Axios from 'axios'
const baseUrl = "/api/v1"
Axios.defaults.baseURL = baseUrl
export default {
    login(email, pass, cb) {
        cb = arguments[arguments.length - 1]
        Axios.post("/login", { email: email, password: pass })
            .then(res => {
                if (res.data.status == 200) {
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
    logout(cb) {
        Axios.get('/logout').then(res => {
            cb(res.data)
        })
        if (cb) cb()
        this.onChange(false)
    },
    loggedIn(cb) {
        Axios.get('/valid')
            .then((res) => {
                if (res.data.status != "ok") {
                    cb(false)
                    this.onChange(false)
                } else {
                    cb(true)
                    this.onChange(true)
                }
            })
        
    },
    whoAmI(cb) {
        Axios.get('/whoami')
            .then(res => {
                cb(res.data)
            })
            .catch(resErr => {
                cb(resErr)
            })
    },
    onChange() { }
}
