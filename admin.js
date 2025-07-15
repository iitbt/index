// admin.js - 导航后台管理页面逻辑

const ADMIN_USER = "admin";
const ADMIN_PASS = "123456";
let isLogin = false;

function showLogin() {
  document.getElementById('loginModal').style.display = 'flex';
}
function hideLogin() {
  document.getElementById('loginModal').style.display = 'none';
}
function login() {
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    isLogin = true;
    hideLogin();
    loadNav();
  } else {
    document.getElementById('loginMsg').innerText = '用户名或密码错误';
  }
}
if (!isLogin) showLogin();

async function loadNav() {
  if (!isLogin) return;
  const res = await fetch('/nav');
  let data = await res.json();
  let flat = [];
  if (Array.isArray(data)) {
    data.forEach(group => {
      if (Array.isArray(group.list)) {
        group.list.forEach(item => {
          flat.push({
            id: item.id,
            group_name: group.name,
            name: item.name,
            url: item.url,
            icon: item.icon
          });
        });
      }
    });
  }
  const tbody = document.querySelector('#navTable tbody');
  tbody.innerHTML = flat.map(item => `
    <tr id="row-${item.id}">
      <td>${item.id ?? ''}</td>
      <td>${item.group_name ?? ''}</td>
      <td>${item.name ?? ''}</td>
      <td><a href="${item.url ?? '#'}" target="_blank">${item.url ?? ''}</a></td>
      <td>${item.icon ?? ''}</td>
      <td class="actions">
        <button type="button" onclick="delNav(${item.id})">删除</button>
      </td>
    </tr>
  `).join('');
}

// 删除
async function delNav(id) {
  if (!isLogin) return showLogin();
  if (!confirm('确定删除？')) return;
  await fetch(`/nav?id=${id}`, {
    method: 'DELETE'
  });
  loadNav();
}

// 新增
document.getElementById('addForm').onsubmit = async e => {
  e.preventDefault();
  if (!isLogin) return showLogin();
  const form = e.target;
  await fetch('/nav', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      group_name: form.group_name.value,
      name: form.name.value,
      url: form.url.value,
      icon: form.icon.value || ''
    })
  });
  form.reset();
  loadNav();
};

window.loadNav = loadNav;
window.delNav = delNav;
window.login = login;

if (isLogin) loadNav();
