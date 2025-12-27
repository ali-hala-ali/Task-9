// ===== Global Variables =====
let users = [];
let posts = [];

// ===== API Functions =====
async function fetchUsers() {
  try {
    const response = await fetch("https://dummyjson.com/users?limit=208");
    const data = await response.json();
    users = data.users || [];
    console.log("تم جلب المستخدمين بنجاح:", users.length);
  } catch (error) {
    console.error("خطأ في جلب المستخدمين:", error);
  }
}

async function fetchPosts() {
  try {
    const response = await fetch("https://dummyjson.com/posts");
    const data = await response.json();
    posts = data.posts || [];
    console.log("تم جلب المنشورات بنجاح:", posts.length);
    displayPosts();
  } catch (error) {
    console.error("خطأ في جلب المنشورات:", error);
    showError("حدث خطأ في تحميل المنشورات");
  }
}

// ===== Helper Functions =====
function getUserName(userId) {
  const user = users.find((u) => u.id === userId);
  return user ? `${user.firstName} ${user.lastName}` : "مستخدم غير معروف";
}

function truncateText(text = "", maxLength = 150) {
  return text.length > maxLength ? text.substring(0, maxLength) + "…" : text;
}

function showError(message) {
  const loading = document.getElementById("loading");
  if (loading)
    loading.innerHTML = `<div style="color: white; font-size: 1.3em;"> ❌ ${message} </div>`;
}

// ===== Display Functions =====
function displayPosts() {
  const container = document.getElementById("postsContainer");
  const loading = document.getElementById("loading");
  if (loading) loading.style.display = "none";

  if (!container) return;

  if (!posts || posts.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: white; padding: 50px;"><h2>لا توجد منشورات لعرضها</h2></div>`;
    return;
  }

  container.innerHTML = posts.map((post) => createPostCard(post)).join("");
}

function createPostCard(post) {
  const likes = post.reactions?.likes ?? 0;
  const userName = getUserName(post.userId);
  const shortBody = truncateText(post.body, 150);

  return `
    <div class="post-card">
      <h2 class="post-title">${escapeHtml(post.title)}</h2>
      <p class="post-body">${escapeHtml(shortBody)}</p>
      <div class="post-meta">
        <span class="post-likes">❤️ ${likes} إعجاب</span>
        <span class="post-author">👤 ${escapeHtml(userName)}</span>
      </div>
      <button class="btn btn-details" onclick="goToPostDetails(${post.id})">
        <span class="btn-icon">🔍</span>
        <span>عرض التفاصيل</span>
      </button>
    </div>
  `;
}

// basic escaping to avoid accidental HTML injection
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ===== Navigation =====
function goToPostDetails(postId) {
  window.location.href = `post.html?id=${postId}`;
}

function goToAddPost() {
  window.location.href = "add-post.html";
}

// ===== Initialization =====
async function init() {
  console.log("=== بدء تحميل صفحة المنشورات ===");
  try {
    await fetchUsers();
    await fetchPosts();
    console.log("=== تم تحميل الصفحة بنجاح ===");
  } catch (error) {
    console.error("خطأ في تهيئة الصفحة:", error);
    showError("حدث خطأ في تحميل الصفحة");
  }
}

document.addEventListener("DOMContentLoaded", init);
