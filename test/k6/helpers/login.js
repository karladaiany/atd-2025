import http from 'k6/http'
import { baseUrl } from './baseURL.js'

export function login(email, password) {
    const payload = {
        email,
        password,
    }
    
    const res = http.post(
        `${baseUrl}/auth/login`,
        JSON.stringify(payload),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )

    let token

    if (res.status === 200) {
      const body = JSON.parse(res.body)
      token = body.data.token
    }

    return { res, token }
}