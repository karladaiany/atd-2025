import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { randomEmail } from './helpers/randomData.js'
import { login } from './helpers/login.js'
import { baseUrl } from './helpers/baseURL.js'

export const options = {
  vus: 10,
  duration: '15s',
  thresholds: {
    http_req_duration: ['p(95)<2000']
  },
};

export default function () {
  const user = {
    email: randomEmail(),
    password: 'password123',
    name: `User ${__VU}-${__ITER}`,
  }
  
  let token

  group('Registro de Usuário', () => {
    const registerPayload = {
      email: user.email,
      password: user.password,
      name: user.name,
    }

    const registerRes = http.post(
      `${baseUrl}/auth/register`,
      JSON.stringify(registerPayload),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    check(registerRes, {
      'Registro: status code é 201': (r) => r.status === 201,
    })
  })

  sleep(0.5)

  group('Login de Usuário', () => {
    const r = login(user.email, user.password).res

    check(r, {
      'Login: status code é 200': (r) => r.status === 200,
    })
  })

  sleep(0.5)

  group('Processamento de Checkout', () => {
    const checkoutPayload = {
      items: [
        {
          productId: 1,
          quantity: 1,
        },
      ],
      paymentMethod: 'cash',
    }

    const checkoutRes = http.post(
      `${baseUrl}/checkout`,
      JSON.stringify(checkoutPayload),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    check(checkoutRes, {
      'Checkout: status code é 200': (r) => r.status === 200,
    })
  })

  sleep(1)
}
