import { DeletionApi } from './account-deletion-api.mjs?v=20261108-2';

const element = id => document.getElementById(id);
const message = text => { element('message').textContent = text; };
const date = value => new Date(value).toLocaleString('ko-KR');
const labels = { requested: '삭제 요청 접수', reviewing: '삭제 범위 검토 중', needs_action: '추가 절차 안내', completed: '삭제 처리 완료', cancelled: '요청 취소' };
let api, request, busy = false;

async function run(work) {
  if (busy) return;
  busy = true;
  document.querySelectorAll('button').forEach(button => { button.disabled = true; });
  try { await work(); } catch (error) {
    message(error.message === 'config' ? '연결 설정을 확인하지 못했습니다. 잠시 후 다시 방문해 주세요.' : /[가-힣]/.test(error.message) ? error.message : '연결 상태를 확인하고 다시 시도해 주세요.');
  } finally {
    busy = false;
    document.querySelectorAll('button').forEach(button => { button.disabled = false; });
    element('login').hidden = !!api?.token;
    element('account').hidden = !api?.token;
  }
}

async function refresh() {
  const data = await api.status();
  request = data.request;
  element('request-status').textContent = request ? (labels[request.status] || '처리 상태 확인 필요') : '접수된 요청이 없습니다.';
  element('request-detail').textContent = request ? `접수 ${date(request.requested_at)} · 처리 또는 안내 기한 ${date(request.respond_by)}` : '';
  element('response').textContent = request?.response || '';
  element('cancel').hidden = request?.status !== 'requested';
  element('request').hidden = !!request && request.status !== 'cancelled';
}

element('login').addEventListener('submit', event => {
  event.preventDefault();
  run(async () => {
    try { await api.login(element('email').value.trim(), element('password').value); }
    finally { element('password').value = ''; }
    await refresh();
    message('본인 확인을 완료했습니다. 삭제 범위를 선택해 주세요.');
  });
});
element('signout').addEventListener('click', () => run(async () => {
  await api.logout();
  request = null;
  ['request-status', 'request-detail', 'response'].forEach(id => { element(id).textContent = ''; });
  element('confirmation').value = '';
  message('로그아웃했습니다.');
}));
element('refresh').addEventListener('click', () => run(async () => { await refresh(); message('처리 상태를 확인했습니다.'); }));
element('request').addEventListener('change', () => {
  element('shared-ack').hidden = document.querySelector('input[name=scope]:checked').value !== 'corewave';
});
element('request').addEventListener('submit', event => {
  event.preventDefault();
  run(async () => {
    const scope = document.querySelector('input[name=scope]:checked').value;
    if (element('confirmation').value.trim() !== '삭제 요청') throw new Error('확인 문구에 삭제 요청을 입력해 주세요.');
    if (scope === 'corewave' && !element('ack').checked) throw new Error('다른 서비스 영향을 확인해 주세요.');
    request = await api.command('request', { scope, confirmation: '삭제 요청', shared_account_ack: scope === 'corewave' && element('ack').checked });
    await refresh();
    message('삭제 요청을 접수했습니다. 즉시 삭제 완료를 의미하지 않습니다.');
  });
});
element('cancel').addEventListener('click', () => run(async () => {
  if (!request || request.status !== 'requested') return;
  await api.command('cancel', { id: request.id });
  await refresh();
  message('삭제 요청을 취소했습니다.');
}));
window.addEventListener('pagehide', () => {
  if (api) api.token = null;
  request = null;
  ['request-status', 'request-detail', 'response'].forEach(id => { element(id).textContent = ''; });
  element('account').hidden = true;
  element('login').hidden = false;
  element('password').value = '';
  element('confirmation').value = '';
  message('계정으로 다시 본인 확인해 주세요.');
});
run(async () => {
  const response = await fetch('./account-deletion-config.json', { cache: 'no-store', credentials: 'omit' });
  if (!response.ok) throw new Error('config');
  api = new DeletionApi(await response.json());
  element('login').hidden = false;
  message('계정으로 본인 확인 후 삭제를 요청할 수 있습니다.');
});
