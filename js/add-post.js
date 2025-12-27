
let users = [];

async function fetchUsers() {
  try {
    const response = await fetch("https://dummyjson.com/users?limit=208");
    const data = await response.json();
    users = data.users || [];
    console.log("تم جلب المستخدمين بنجاح:", users.length);
    populateUsersSelect();
  } catch (error) {
    console.error("خطأ في جلب المستخدمين:", error);
    alert("❌ حدث خطأ في تحميل قائمة المستخدمين");
  }
}

async function addPost(postData) {
  try {
    const response = await fetch("https://dummyjson.com/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    const result = await response.json();
    console.log("=== تم إضافة المنشور بنجاح ===");
    console.log("Response الكامل:", result);
    return result;
  } catch (error) {
    console.error("❌ خطأ في إضافة المنشور:", error);
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
  console.log("=== بدء عملية إضافة منشور جديد ===");
  const formData = {
    title: document.getElementById("title").value.trim(),
    body: document.getElementById("body").value.trim(),
    userId: parseInt(document.getElementById("userId").value),
  };
  console.log("بيانات النموذج:", formData);
  const validation = validateFormData(formData);
  if (!validation.isValid) {
    showErrors(validation.errors);
    return;
  }
  setSubmitButtonState(true);
  try {
    await addPost(formData);
    alert("✅ تم إضافة المنشور بنجاح!");
    window.location.href = "posts.html";
  } catch (error) {
    setSubmitButtonState(false);
    alert("❌ حدث خطأ في إضافة المنشور. يرجى المحاولة مرة أخرى.");
  }
}

function goBack() {
  window.location.href = "posts.html";
}

async function init() {
  console.log("=== بدء تحميل صفحة إضافة منشور ===");
  const form = document.getElementById("addPostForm");
  if (form) form.addEventListener("submit", handleFormSubmit);
  await fetchUsers();
  console.log("=== تم تحميل الصفحة بنجاح ===");
}

document.addEventListener("DOMContentLoaded", init);

