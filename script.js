// URL skrip dari Google Spreadsheet milikmu
const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbz-4qRO6H2U6ll1UWuridUld8aT6eo3fSpd-cCKDobSx6ACHbSisluhSAYm6BAHdCN0EQ/exec";

const bmiText = document.getElementById("bmi");
const descText = document.getElementById("desc");
const form = document.querySelector("form");
const userNameText = document.getElementById("userName");

form.addEventListener("submit", handleSubmit);
form.addEventListener("reset", handleReset);

function handleReset() {
  bmiText.textContent = 0;
  bmiText.className = "";
  descText.textContent = "N/A";
  userNameText.textContent = "Your BMI is";
}

function handleSubmit(e) {
  e.preventDefault();

  const name = form.name.value;
  const age = form.age.value;
  const gender = form.gender.value;
  const weight = form.weight.value;
  const height = form.height.value;

  const weightFloat = parseFloat(weight);
  const heightFloat = parseFloat(height);

  if (isNaN(weightFloat) || isNaN(heightFloat) || weightFloat <= 0 || heightFloat <= 0) {
    alert("Please enter a valid weight and height");
    return;
  }
  
  // Kalkulasi BMI untuk ditampilkan di halaman
  const heightInMeters = heightFloat / 100;
  const bmi = weightFloat / Math.pow(heightInMeters, 2);
  const desc = interpretBMI(bmi);

  userNameText.textContent = name ? `${name}'s BMI is` : "Your BMI is";
  bmiText.textContent = bmi.toFixed(2);
  bmiText.className = desc;
  descText.innerHTML = `You are <strong>${desc}</strong>`;

  // Mengirim data ke Google Sheets menggunakan Fetch API
  const formData = new FormData(form);
  fetch(SPREADSHEET_URL, {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log("Data berhasil dikirim ke Google Sheets:", data);
    alert("Data berhasil disimpan!");
  })
  .catch(error => {
    console.error("Error saat mengirim data:", error);
    alert("Gagal menyimpan data.");
  });
}

function interpretBMI(bmi) {
  if (bmi < 18.5) {
    return "underweight";
  } else if (bmi < 25) {
    return "healthy";
  } else if (bmi < 30) {
    return "overweight";
  } else {
    return "obese";
  }
}