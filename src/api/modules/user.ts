import http from '../http'

function login(params: LoginParams) {
  return http.post<LoginModel>('user/login', params)
}

/**
 * 获取验证码
 * @param phone 手机号
 */
function getCode(phone: string): Promise<{ num: number }> {
  return http.get('random/code', {
    params: {
      phone
    }
  })
}

function logout() {
  return http.post('user/logout', {})
}

export default {
  login,
  getCode,
  logout
}
