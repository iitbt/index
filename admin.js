// admin.js - 导航后台管理页面逻辑

// 简单前端权限（演示用，生产请用后端鉴权）
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

// 渲染表格
async function loadNav() {
  if (!isLogin) return;
  const res = await fetch('/nav');
  let data = await res.json();

  // 扁平化分组数据
  let flat = [];
  if (Array.isArray(data)) {
    data.forEach(group => {
      if (Array.isArray(group.list)) {
        group.list.forEach(item => {
          flat.push({
            id: item.id,
            group_name: group.name, // 分组名
            name: item.name,
            url: item.url,
            icon: item.icon
          });
        });
      }
    });
  }
  // 渲染表格
  const tbody = document.querySelector('#navTable tbody');
  tbody.innerHTML = flat.map(item => `
    <tr id="row-${item.id}">
      <td>${item.id ?? ''}</td>
      <td>${item.group_name ?? ''}</td>
      <td>${item.name ?? ''}</td>
      <td><a href="${item.url ?? '#'}" target="_blank">${item.url ?? ''}</a></td>
      <td>${item.icon ?? ''}</td>
      <td class="actions">
        <button type="button" onclick="editRow(${item.id})">编辑</button>
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

// 编辑
function editRow(id) {
  if (!isLogin) return showLogin();
  const row = document.getElementById('row-' + id);
  const tds = row.querySelectorAll('td');
  const [idTd, groupTd, nameTd, urlTd, iconTd, actionsTd] = tds;
  row.classList.add('edit-row');
  groupTd.innerHTML = `<input value="${groupTd.textContent}">`;
  nameTd.innerHTML = `<input value="${nameTd.textContent}">`;
  urlTd.innerHTML = `<input value="${urlTd.textContent}">`;
  iconTd.innerHTML = `<input value="${iconTd.textContent}">`;
  actionsTd.innerHTML = `
    <button type="button" onclick="saveRow(${id})">保存</button>
    <button type="button" onclick="cancelEdit(${id})">取消</button>
  `;
}
function cancelEdit(id) {
  loadNav();
}
async function saveRow(id) {
  if (!isLogin) return showLogin();
  const row = document.getElementById('row-' + id);
  const inputs = row.querySelectorAll('input');
  const [group_name, name, url, icon] = Array.from(inputs).map(i => i.value.trim());

  if (!group_name || !name || !url) {
    alert('分组、名称、网址不能为空！');
    return;
  }

  const res = await fetch('/nav/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ group_name, name, url, icon: icon || '' })
  });

  if (res.ok) {
    // 尝试解析json
    let result;
    try {
      result = await res.json();
    } catch {
      result = null;
    }
    if (result && result.success) {
      loadNav();
    } else {
      alert('保存失败：' + (result && result.error ? result.error : '未知错误'));
    }
  } else {
    const msg = await res.text();
    alert('保存失败：' + msg);
  }
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
window.editRow = editRow;
window.cancelEdit = cancelEdit;
window.saveRow = saveRow;
window.login = login;

if (isLogin) loadNav();
