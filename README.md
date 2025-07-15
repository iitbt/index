# 十七号球衣导航项目部署说明

本项目支持两种部署方式：
1. 本地 Node.js + MySQL 部署
2. Cloudflare Workers + Cloudflare D1 云端无服务器部署

---

## 一、本地部署（Node.js + MySQL）

### 1. 环境准备
- 需要安装 [Node.js](https://nodejs.org/)（建议 LTS 版本）
- 需要有 MySQL 数据库（如 sqlpub.com 提供的远程 MySQL）

### 2. 数据库准备
1. 登录你的 MySQL 数据库，执行以下 SQL 创建表：

```sql
CREATE TABLE nav_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(50),
  name VARCHAR(100),
  url VARCHAR(255),
  icon VARCHAR(255)
);
```

2. 将导航数据批量插入（见“导航数据 SQL”部分，或用 nav_table.sql 文件）。

### 3. 安装依赖
在项目根目录下打开命令行，依次执行：

```bash
npm init -y
npm install express mysql
```

### 4. 配置 nav-api.js
编辑 `nav-api.js`，填写你的数据库连接信息：

```js
const db = mysql.createConnection({
  host: 'mysql5.sqlpub.com',
  port: 3310,
  user: '你的用户名',
  password: '你的密码',
  database: '你的数据库名'
});
```

### 5. 启动后端服务

```bash
node nav-api.js
```

看到“导航API服务已启动: http://localhost:3000”即成功。

### 6. 前端页面配置
- `index.js` 会自动优先从云端 API（Cloudflare 部署时为当前域名 /nav）获取导航数据，失败时自动尝试本地 API（http://localhost:3000/nav），仍失败则用初始 groups 数据。
- 用浏览器打开 `index.html` 即可访问导航页面。

---

## 二、Cloudflare Workers + Cloudflare D1 云端无服务器部署（GitHub 一键集成推荐）

### 1. 注册并登录 Cloudflare
- 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) 注册并登录。

### 2. Fork 或上传你的项目到 GitHub
- 如果你还没有 GitHub 账号，请先注册 [GitHub](https://github.com/)。
- 将本项目上传到你的 GitHub 仓库，或直接 Fork 本项目。

### 3. 在 Cloudflare Dashboard 连接 GitHub 仓库
- 进入 Cloudflare Dashboard → Workers & Pages → Pages → “Create Application”
- 选择 “Connect to Git” → 选择 GitHub → 授权 Cloudflare 访问你的 GitHub 仓库
- 选择你上传的导航项目仓库


### 4. 配置 D1 数据库
- 在 Cloudflare Dashboard → Workers & Pages → D1，创建数据库（如 nav_table）
- 在 Pages 项目设置 → Functions → D1 Bindings，添加 D1 数据库绑定
  - Variable name 填 `nav_table`
  - Database 选择你的 D1 数据库

### 5. 再次部署
- 在部署成功的页面点击 “查看详细信息”，选择 “部署管理” ，点击 “重试部署”。
- 因为添加 D1 数据库绑定后需要重新部署才能生效。

### 6. 自动部署
- 每次你 Push 代码到 GitHub，Cloudflare 会自动检测并自动部署到 Workers + D1
- 部署完成后，Cloudflare 会分配一个公开访问地址（如 `https://your-project.pages.dev` 或 `https://your-worker-name.workers.dev`）

- 用浏览器打开 `index.html` 即可访问导航页面

---

### 常见问题与建议

- **无需本地命令行操作**，全程可在网页端完成，适合初学者
- 支持自动化持续集成，每次推送自动部署
- D1 免费额度大，适合个人/小团队
- 更多官方文档：
  - [Cloudflare Pages 官方文档](https://developers.cloudflare.com/pages/)
  - [Cloudflare Workers 官方文档](https://developers.cloudflare.com/workers/)
  - [Cloudflare D1 官方文档](https://developers.cloudflare.com/d1/)

---

如有问题，欢迎提 issue 或联系作者。

---

## Cloudflare D1 数据库快速增加和删除数据（官方最佳实践）

Cloudflare D1 是一款无服务器的 SQLite 数据库，支持多种方式进行数据的增删查改（CRUD）操作。以下为最常用的三种方法：

---

### 1. 可视化网页界面（最适合初学者）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Workers & Pages → D1 → 选择你的数据库（如 nav_table）
3. 点击左侧“数据”或“Data”标签页
4. 你可以：
   - **增加数据**：点击“Insert Row”或“添加行”，填写内容后保存
   - **删除数据**：选中某一行，点击“Delete”或“删除”按钮即可
   - **编辑数据**：点击某一行的“Edit”按钮，修改后保存

> 适合手动管理少量数据，无需写代码。

---

### 2. SQL 控制台（适合批量操作和开发者）

1. 在 Cloudflare Dashboard → D1 → 你的数据库 → “控制台”或“Console”标签页
2. 输入并执行 SQL 语句：

**增加数据（插入）：**
```sql
INSERT INTO nav_table (group_name, name, url, icon)
VALUES ('工具', '百度', 'https://www.baidu.com', 'baidu.svg');
```

**删除数据：**
- 删除指定 id 的数据：
  ```sql
  DELETE FROM nav_table WHERE id = 1;
  ```
- 批量删除（如删除所有“工具”分组的数据）：
  ```sql
  DELETE FROM nav_table WHERE group_name = '工具';
  ```

**查询数据：**
```sql
SELECT * FROM nav_table WHERE group_name = '工具';
```

> 支持所有 SQLite 语法，适合批量导入、批量删除、复杂查询。

---

### 3. 命令行 wrangler 工具（适合自动化和本地开发）

Cloudflare 官方推荐使用 wrangler 工具进行本地或远程数据库管理，适合批量导入、备份、自动化脚本等场景。

**安装 wrangler：**
```bash
npm install -g wrangler
```

**插入数据：**
```bash
npx wrangler d1 execute <数据库名> --remote --command "INSERT INTO nav_table (group_name, name, url, icon) VALUES ('工具', '百度', 'https://www.baidu.com', 'baidu.svg');"
```

**删除数据：**
```bash
npx wrangler d1 execute <数据库名> --remote --command "DELETE FROM nav_table WHERE id = 1;"
```

**批量导入 SQL 文件：**
```bash
npx wrangler d1 execute <数据库名> --remote --file=./nav_table.sql
```

> `<数据库名>` 替换为你的 D1 数据库名称。  
> `--remote` 表示操作线上数据库，去掉则为本地开发数据库。

---

### 4. 在 Worker 代码中操作 D1（API/自动化）

你可以在 Cloudflare Worker 代码中直接用 JavaScript 操作 D1 数据库：

```js
export default {
  async fetch(request, env) {
    // 插入数据
    await env.DB.prepare(
      "INSERT INTO nav_table (group_name, name, url, icon) VALUES (?, ?, ?, ?)"
    ).bind("工具", "百度", "https://www.baidu.com", "baidu.svg").run();

    // 删除数据
    await env.DB.prepare(
      "DELETE FROM nav_table WHERE id = ?"
    ).bind(1).run();

    // 查询数据
    const { results } = await env.DB.prepare(
      "SELECT * FROM nav_table"
    ).all();

    return Response.json(results);
  }
}
```
> 适合开发自定义 API、后台管理页面等。

---

### 5. 最佳实践与常见问题

- **批量导入/删除**：建议将多条 SQL 写入一个 .sql 文件，用 wrangler 一次性导入，效率更高。
- **数据备份**：可用 wrangler 导出数据，或定期导出表内容。
- **避免全表扫描**：如需分页，建议用主键游标分页，避免 `SELECT count(*)` 造成性能问题。
- **JSON 字段支持**：D1 支持 SQLite 的 JSON 查询语法，可直接存储和查询 JSON 数据。
- **权限与安全**：生产环境建议只开放必要的 API，避免 SQL 注入风险。

---

### 6. 参考文档

- [Cloudflare D1 官方文档](https://developers.cloudflare.com/d1/)
- [D1 SQL 语法与 API](https://developers.cloudflare.com/d1/best-practices/query-d1/)
- [Wrangler D1 命令行用法](https://developers.cloudflare.com/d1/get-started/)

---

如需具体 SQL 示例、批量导入模板或后台管理页面开发指导，欢迎随时联系作者！

---

### 7. 批量导入模板示例

如果你有大量导航数据需要一次性导入 D1 数据库，推荐将多条 SQL 写入一个 .sql 文件，然后用 wrangler 一次性导入。

**nav_table.sql 示例：**
```sql
INSERT INTO nav_table (group_name, name, url, icon) VALUES
  ('工具', '百度', 'https://www.baidu.com', 'baidu.svg'),
  ('工具', '谷歌', 'https://www.google.com', 'google.svg'),
  ('学习', '慕课网', 'https://www.imooc.com', 'imooc.svg');
```

**导入命令：**
```bash
npx wrangler d1 execute <数据库名> --remote --file=./nav_table.sql
```

> 建议每次批量导入前先备份数据库，避免误操作。

---

### 8. 后台管理页面开发建议与示例

如果你希望让非技术用户也能方便地管理 D1 数据库中的导航数据，可以开发一个简单的后台管理页面（仅用 HTML+JS 即可，无需框架）。

**基本思路：**
- 前端页面通过 API（如 /nav）与 Cloudflare Worker 通信，Worker 负责操作 D1 数据库。
- 支持增、删、查、改（CRUD）操作。
- 可用 fetch 发送 POST/GET/DELETE 请求。

**简单示例（前端 HTML+JS）：**
```html
<!-- admin.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>导航后台管理</title>
  <style>
    body { font-family: Arial; margin: 2em; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; }
    th { background: #f5f5f5; }
    input, button { margin: 4px; }
  </style>
</head>
<body>
  <h2>导航后台管理</h2>
  <form id="addForm">
    <input name="group_name" placeholder="分组" required>
    <input name="name" placeholder="名称" required>
    <input name="url" placeholder="网址" required>
    <input name="icon" placeholder="图标" required>
    <button type="submit">添加</button>
  </form>
  <table id="navTable">
    <thead><tr><th>ID</th><th>分组</th><th>名称</th><th>网址</th><th>图标</th><th>操作</th></tr></thead>
    <tbody></tbody>
  </table>
  <script>
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
  </script>
</body>
</html>
```

**Worker 端 API 伪代码（Node/JS）：**
```js
// 伪代码，需根据实际 Worker 框架调整
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/nav') {
      // 查询所有导航
      const { results } = await env.DB.prepare('SELECT * FROM nav_table').all();
      return Response.json(results);
    }
    if (request.method === 'POST' && url.pathname === '/nav') {
      const body = await request.json();
      await env.DB.prepare('INSERT INTO nav_table (group_name, name, url, icon) VALUES (?, ?, ?, ?)')
        .bind(body.group_name, body.name, body.url, body.icon).run();
      return new Response('ok');
    }
    if (request.method === 'DELETE' && url.pathname.startsWith('/nav/')) {
      const id = url.pathname.split('/').pop();
      await env.DB.prepare('DELETE FROM nav_table WHERE id = ?').bind(id).run();
      return new Response('ok');
    }
    return new Response('Not found', { status: 404 });
  }
}
```

> 你可以将 admin.html 上传到 Cloudflare Pages 或直接放在项目根目录，配合 Worker API 实现可视化管理。

---

