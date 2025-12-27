// ===== Global Variables =====
let postId = null;
let users = [];
let currentPost = null;

function getPostIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

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

async function fetchPostDetails() {
  try {
    const response = await fetch(`https://dummyjson.com/posts/${postId}`);
    currentPost = await response.json();
    console.log("تم جلب تفاصيل المنشور");
    displayPost(currentPost);
  } catch (error) {
    console.error("خطأ في جلب تفاصيل المنشور:", error);
    showError("حدث خطأ في تحميل المنشور");
  }
}

async function fetchComments() {
  try {
    const response = await fetch(
      `https://dummyjson.com/posts/${postId}/comments`
    );
    const data = await response.json();
    console.log("تم جلب التعليقات:", data.comments?.length ?? 0);
    displayComments(data.comments || []);
  } catch (error) {
    console.error("خطأ في جلب التعليقات:", error);
  }
}

async function deletePost() {
  if (
    !confirm(
      "هل أنت متأكد من حذف هذا المنشور؟\n\nلا يمكن التراجع عن هذا الإجراء."
    )
  )
    return;
  try {
    const response = await fetch(`https://dummyjson.com/posts/${postId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    console.log("=== تم حذف المنشور بنجاح ===");
    console.log("Response:", result);
    alert("✅ تم حذف المنشور بنجاح!");
    window.location.href = "posts.html";
  } catch (error) {
    console.error("❌ خطأ في حذف المنشور:", error);
    alert("❌ حدث خطأ في حذف المنشور. يرجى المحاولة مرة أخرى.");
  }
}

function getUserName(userId) {
  const user = users.find((u) => u.id === userId);
  return user ? `${user.firstName} ${user.lastName}` : "مستخدم غير معروف";
}

function showError(message) {
  const loading = document.getElementById("loading");
  if (loading)
    loading.innerHTML = `<div style="color: white; font-size: 1.3em; text-align: center;"> ❌ ${message} </div>`;
}

function displayPost(post) {
  const container = document.getElementById("postContainer");
  const loading = document.getElementById("loading");
  if (loading) loading.style.display = "none";

  const likes = post.reactions?.likes ?? 0;
  const views = post.views ?? "غير متوفر";
  const userName = getUserName(post.userId);

  if (container) {
    container.innerHTML = `
      <div class="post-detail">
        <div class="post-header">
          <h1 class="post-title">${escapeHtml(post.title)}</h1>
          <div class="post-meta">
            <span class="meta-item">👤 ${escapeHtml(userName)}</span>
            <span class="meta-item">❤️ ${likes} إعجاب</span>
            <span class="meta-item">👁️ ${escapeHtml(
              String(views)
            )} مشاهدة</span>
          </div>
        </div>
        <p class="post-body">${escapeHtml(post.body)}</p>
        <div class="tags-section">
          <h3 class="tags-title">🏷️ الوسوم</h3>
          <div class="tags">${(post.tags || [])
            .map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`)
            .join("")}</div>
        </div>
        <div class="actions">
          <button class="btn btn-edit" onclick="editPost()"><span class="btn-icon">✏️</span><span>تعديل المنشور</span></button>
          <button class="btn btn-delete" onclick="deletePost()"><span class="btn-icon">🗑️</span><span>حذف المنشور</span></button>
        </div>
      </div>
    `;
  }
}

function displayComments(comments) {
  const container = document.getElementById("commentsContainer");
  if (!container) return;

  if (!comments || comments.length === 0) {
    container.innerHTML = `<div class="comments-section"><h2 class="comments-title">💬 التعليقات</h2><p style="color: #666; text-align: center; padding: 30px;"> لا توجد تعليقات على هذا المنشور بعد </p></div>`;
    return;
  }

  container.innerHTML = `<div class="comments-section"><h2 class="comments-title">💬 التعليقات (${
    comments.length
  })</h2>${comments
    .map((comment) => createCommentHTML(comment))
    .join("")}</div>`;
}

function createCommentHTML(comment) {
  return `<div class="comment"><div class="comment-user">👤 ${escapeHtml(
    comment.user?.username || "زائر"
  )}</div><div class="comment-body">${escapeHtml(comment.body)}</div></div>`;
}

function editPost() {
  window.location.href = `edit-post.html?id=${postId}`;
}

function goBack() {
  window.location.href = "posts.html";
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function init() {
  console.log("=== بدء تحميل صفحة تفاصيل المنشور ===");
  postId = getPostIdFromURL();
  if (!postId) {
    alert("❌ لم يتم تحديد المنشور");
    window.location.href = "posts.html";
    return;
  }

  console.log("Post ID:", postId);

  try {
    await Promise.all([fetchUsers(), fetchPostDetails(), fetchComments()]);
    console.log("=== تم تحميل الصفحة بنجاح ===");
  } catch (error) {
    console.error("خطأ في تهيئة الصفحة:", error);
    showError("حدث خطأ في تحميل الصفحة");
  }
}

document.addEventListener("DOMContentLoaded", init);
