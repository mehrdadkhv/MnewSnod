document.getElementById("imageUpload").onclick = function () {
  let xhttp = new XMLHttpRequest(); // create new ajax request

  const selectedImage = document.getElementById("selectedImage");
  const imageStatus = document.getElementById("imageStatus");
  const progressDiv = document.getElementById("progressDiv");
  const progressBar = document.getElementById("progressBar");
  const uploadResult = document.getElementById("uploadResult");

  xhttp.responseType = "json";

  xhttp.onreadystatechange = function () {
    if (xhttp.status === 200) {
      imageStatus.innerHTML = "اپلود عکس موفقیت آمیز بود";
      uploadResult.innerText = this.responseText;
      selectedImage.value = ""; //clear input file
    } else {
      imageStatus.innerHTML = this.responseText;
    }
  };
  xhttp.open("POST", "/dashboard/image-upload");
  let formData = new FormData();

  xhttp.upload.onprogress = function (e) {
    if (e.lengthComputable) {
      let result = Math.floor((e.loaded / e.total) * 100);
      // console.log(result + "%");
      if (result !== 100) {
        // progressBar.innerHTML = result + "%";
        progressBar.style = "width:" + result + "%";
      } else {
        progressDiv.style = "display: none";
      }
    }
  };

  if (selectedImage.files.length > 0) {
    progressDiv.style = "display: block";
    formData.append("image", selectedImage.files[0]);
    xhttp.send(formData);
  } else {
    imageStatus.innerHTML = "برای آپلود باید تصویر معتبر انتخاب شود";
  }
};
