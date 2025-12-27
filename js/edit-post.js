
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
    populateUsersSelect();
  } catch (error) {
    console.error("خطأ في جلب المستخدمين:", error);
  }
}

async function fetchPostData() {
  try {
    const response = await fetch(`https://dummyjson.com/posts/${postId}`);
    currentPost = await response.json();
    console.log("تم جلب بيانات المنشور:", currentPost);
    fillFormWithPostData(currentPost);
  } catch (error) {
    console.error("خطأ في جلب بيانات المنشور:", error);
    alert("❌ حدث خطأ في تحميل بيانات المنشور");
    goBack();
  }
}

async function updatePost(postData) {
  try {
    const response = await fetch(`https://dummyjson.com/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    const result = await response.json();
    console.log("=== تم تعديل المنشور بنجاح ===");
    console.log("Response الكامل:", result);
    return result;
  } catch (error) {
    console.error("❌ خطأ في تعديل المنشور:", error);
    throw error;
  }
}

function populateUsersSelect() {
  const select = document.getElementById("userId");
  if (!select) return;
  select.innerHTML = '<option value="">اختر المستخدم...</option>';
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = `${user.firstName} ${user.lastName} (${user.username})`;
    select.appendChild(option);
  });
}

function fillFormWithPostData(post) {
  const titleEl = document.getElementById("title");
  const bodyEl = document.getElementById("body");
  if (titleEl) titleEl.value = post.title || "";
  if (bodyEl) bodyEl.value = post.body || "";
  setTimeout(() => {
    const select = document.getElementById("userId");
    if (select) select.value = post.userId;
  }, 100);
  const loading = document.getElementById("loading");
  const formContainer = document.getElementById("formContainer");
  if (loading) loading.style.display = "none";
  if (formContainer) formContainer.style.display = "block";
}

function validateFormData(formData) {
  const errors = [];
  if (!formData.title || formData.title.trim().length === 0)
    errors.push("عنوان المنشور مطلوب");
  else if (formData.title.trim().length < 3)
    errors.push("عنوان المنشور يجب أن يكون 3 أحرف على الأقل");
  if (!formData.body || formData.body.trim().length === 0)
    errors.push("نص المنشور مطلوب");
  else if (formData.body.trim().length < 10)
    errors.push("نص المنشور يجب أن يكون 10 أحرف على الأقل");
  if (!formData.userId) errors.push("يجب اختيار المستخدم");
  return { isValid: errors.length === 0, errors };
}

function showErrors(errors) {
  const errorMessage = errors.map((error) => `• ${error}`).join("\n");
  alert(`⚠️ يرجى تصحيح الأخطاء التالية:\n\n${errorMessage}`);
}

function setSubmitButtonState(disabled) {
  const submitBtn = document.getElementById("submitBtn");
  const loadingMessage = document.getElementById("loadingMessage");
  if (submitBtn) submitBtn.disabled = disabled;
  if (loadingMessage) loadingMessage.style.display = disabled ? "flex" : "none";
}

async function handleFormSubmit(e) {
  e.preventDefault();
  console.log("=== بدء عملية تعديل المنشور ===");
  const formData = {
    title: document.getElementById("title").value.trim(),
    body: document.getElementById("body").value.trim(),
    userId: parseInt(document.getElementById("userId").value),
  };
  console.log("البيانات الجديدة:", formData);
  const validation = validateFormData(formData);
  if (!validation.isValid) {
    showErrors(validation.errors);
    return;
  }
  setSubmitButtonState(true);
  try {
    await updatePost(formData);
    alert("✅ تم تعديل المنشور بنجاح!");
    window.location.href = `post.html?id=${postId}`;
  } catch (error) {
    setSubmitButtonState(false);
    alert("❌ حدث خطأ في تعديل المنشور. يرجى المحاولة مرة أخرى.");
  }
}

function goBack() {
  if (postId) window.location.href = `post.html?id=${postId}`;
  else window.location.href = "posts.html";
}

async function init() {
  console.log("=== بدء تحميل صفحة تعديل المنشور ===");
  postId = getPostIdFromURL();
  if (!postId) {
    alert("❌ لم يتم تحديد المنشور");
    window.location.href = "posts.html";
    return;
  }
  const form = document.getElementById("editPostForm");
  if (form) form.addEventListener("submit", handleFormSubmit);
  try {
    await Promise.all([fetchUsers(), fetchPostData()]);
    console.log("=== تم تحميل الصفحة بنجاح ===");
  } catch (error) {
    console.error("خطأ في تهيئة الصفحة:", error);
  }
}

document.addEventListener("DOMContentLoaded", init);

