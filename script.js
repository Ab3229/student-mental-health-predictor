const API_BASE_URL = "https://student-mental-health-predictor-390e.onrender.com/";
const API_URL = `${API_BASE_URL}/predict`;

const form = document.getElementById("predict-form");
const submitBtn = document.getElementById("submit-btn");
const errorEl = document.getElementById("form-error");

const gaugeFill = document.getElementById("gauge-fill");
const gaugeValue = document.getElementById("gauge-value");
const resultLabel = document.getElementById("result-label");
const resultDetail = document.getElementById("result-detail");

const GAUGE_LENGTH = 251;

const sliderIds = [
  "avg_daily_usage_hours",
  "study_hours",
  "physical_activity_hours",
  "sleep_hours_per_night",
];

function syncSliderValue(id) {
  const input = document.getElementById(id);
  const out = document.getElementById(`${id}-out`);
  if (!input || !out) return;

  const value = parseFloat(input.value);
  out.textContent = `${value.toFixed(1)} hrs`;
}

sliderIds.forEach((id) => {
  const input = document.getElementById(id);
  if (!input) return;

  syncSliderValue(id);
  input.addEventListener("input", () => syncSliderValue(id));
});

function setGauge(score) {
  const clamped = Math.max(0, Math.min(10, Number(score) || 0));
  const fraction = clamped / 10;
  const offset = GAUGE_LENGTH - fraction * GAUGE_LENGTH;

  gaugeFill.style.strokeDashoffset = offset;
  gaugeValue.textContent = clamped.toFixed(1);

  let color = "#DE9B4C";
  let label = "Middling — some room to recover.";
  let detail = "A mix of habits are pulling in different directions. Small changes to sleep or scrolling time tend to move this the most.";

  if (clamped >= 7) {
    color = "#4C8B6E";
    label = "Looking solid.";
    detail = "Your reported sleep, activity, and usage patterns line up with students who report doing well.";
  } else if (clamped < 4) {
    color = "#C1613F";
    label = "Worth paying attention to.";
    detail = "This estimate leans low — often tied to short sleep or heavy daily usage. It's a pattern, not a verdict.";
  }

  gaugeFill.style.stroke = color;
  resultLabel.textContent = label;
  resultDetail.textContent = detail;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";

  const country = document.getElementById("country").value.trim();
  if (!country) {
    errorEl.textContent = "Please enter your country so the model can place your profile correctly.";
    return;
  }

  const payload = {
    age: parseInt(document.getElementById("age").value, 10),
    gender: document.getElementById("gender").value,
    country,
    academic_level: document.getElementById("academic_level").value,
    most_used_platform: document.getElementById("most_used_platform").value,
    purpose_of_use: document.getElementById("purpose_of_use").value,
    avg_daily_usage_hours: parseFloat(document.getElementById("avg_daily_usage_hours").value),
    daily_unlocks: parseInt(document.getElementById("daily_unlocks").value, 10),
    study_hours: parseFloat(document.getElementById("study_hours").value),
    physical_activity_hours: parseFloat(document.getElementById("physical_activity_hours").value),
    sleep_hours_per_night: parseFloat(document.getElementById("sleep_hours_per_night").value),
    stress_level: document.getElementById("stress_level").value,
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Estimating...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "cors",
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const detail = errBody.detail ? JSON.stringify(errBody.detail) : `Request failed (${response.status})`;
      throw new Error(detail);
    }

    const data = await response.json();
    setGauge(data.predicted_mental_health_score);
  } catch (err) {
    errorEl.textContent = `Couldn't reach the model: ${err.message}. Make sure the FastAPI server is running at ${API_BASE_URL}.`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Estimate my score";
  }
});
