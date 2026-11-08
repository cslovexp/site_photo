export class DeletionApi {
  constructor(config, transport = fetch) {
    const url = new URL(config.url);
    if (url.origin !== 'https://xjlycxgdpiqbgnzwwzsc.supabase.co') throw new Error('config');
    const key = config.publishableKey;
    if (!key?.startsWith('sb_publishable_')) {
      let role;
      try { role = JSON.parse(atob(key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).role; } catch { /* Invalid public config. */ }
      if (role !== 'anon') throw new Error('config');
    }
    this.base = url.origin;
    this.key = key;
    this.transport = transport;
    this.token = null;
  }
  async call(path, body, token = this.token) {
    const response = await this.transport(`${this.base}/${path}`, {
      method: 'POST', cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer',
      headers: { apikey: this.key, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      if (response.status === 401) this.token = null;
      throw new Error(response.status === 401 ? '로그인 상태를 다시 확인해 주세요.' : '연결 상태와 입력 내용을 확인하고 다시 시도해 주세요.');
    }
    return response.json();
  }
  async login(email, password) {
    const result = await this.call('auth/v1/token?grant_type=password', { email, password }, null);
    if (!result.user?.email_confirmed_at || !result.access_token) throw new Error('이메일 인증 후 다시 로그인해 주세요.');
    this.token = result.access_token;
  }
  status() { return this.command('status', {}); }
  command(action, payload) {
    if (!this.token) throw new Error('먼저 로그인해 주세요.');
    return this.call('rest/v1/rpc/site_photo_report_account_deletion', { action, payload });
  }
  async logout() {
    const token = this.token;
    this.token = null;
    if (token) await this.call('auth/v1/logout?scope=local', {}, token).catch(() => {});
  }
}
