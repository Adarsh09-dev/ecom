document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("profile_image");

  if (input) {
    input.addEventListener("change", () => {
      input.form.submit();
    });
  }
});
