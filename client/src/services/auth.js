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
    },
    register(email, pass, first, last, cb) {
        cb = arguments[arguments.length - 1]
        Axios.post('/register', {
            email: email,
            password: pass,
            first_name: first,
            last_name: last
        }).then(res => {
            if (res.data.status == 200) {
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
    update(email, pass, first, last, cb) {
        cb = arguments[arguments.length - 1]
        Axios.post('/update', {
            email: email,
            password: pass,
            first_name: first,
            last_name: last
        }).then(res => {
            cb(res)
        }).catch(err => {
            console.log(err)
            cb(false)
            this.onChange(false)
        })
    },
    logout(cb) {
        Axios.get('/logout', {
            withCredentials: true
        }).then(res => {
            cb(res.data)
        })
        this.onChange(false)
    },
    loggedIn(cb) {
        Axios.get('/valid')
          .then(() => {
              cb(true)
          })
          .catch(() => {
              cb(false)
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
