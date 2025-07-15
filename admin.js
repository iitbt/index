// admin.js - 导航后台管理页面逻辑

async function loadNav() {
  const res = await fetch('/nav');
  const data = await res.json();
  const tbody = document.querySelector('#navTable tbody');
  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.group_name}</td>
      <td>${item.name}</td>
      <td><a href="${item.url}" target="_blank">${item.url}</a></td>
      <td>${item.icon}</td>
      <td><button onclick="delNav(${item.id})">删除</button></td>
    </tr>
  `).join('');
}

async function delNav(id) {
  if (!confirm('确定删除？')) return;
  await fetch('/nav/' + id, { method: 'DELETE' });
  loadNav();
}

document.getElementById('addForm').onsubmit = async e => {
  e.preventDefault();
  const form = e.target;
  await fetch('/nav', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      group_name: form.group_name.value,
      name: form.name.value,
      url: form.url.value,
      icon: form.icon.value
    })
  });
  form.reset();
  loadNav();
};

loadNav();
