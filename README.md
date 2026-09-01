# Student Mental Health Predictor

Predicts a student's mental health score from their social media usage and lifestyle habits, using a **FastAPI** backend serving a trained **machine learning model**, with a lightweight **HTML/CSS/JS** frontend for real-time predictions.

## Overview

Social media use, sleep, study load, and stress all shape how students feel day to day. This project trains a regression model on a student social media & mental health dataset, then serves it behind a REST API so anyone can enter their own habits and get an estimated wellbeing score (0–10) instantly in the browser.

## Features

- Predicts a **mental health score** from 12 lifestyle and usage inputs (age, gender, country, academic level, platform, purpose of use, daily usage hours, phone unlocks, study hours, physical activity, sleep, stress level)
- REST API built with **FastAPI**, with request validation via **Pydantic**
- Simple, responsive frontend with sliders and dropdowns, connected live to the API
- Visual gauge showing where the predicted score falls, with a short interpretation
- CORS enabled so the frontend can be served from anywhere and still reach the API

## Live Link

https://student-mental-health-predictor-1.onrender.com/

## Tech stack

| Layer      | Tools |
|------------|-------|
| Model      | scikit-learn (trained in `ML_Project.ipynb`), saved with `joblib` |
| Backend    | FastAPI, Pydantic, Uvicorn |
| Frontend   | HTML, CSS, vanilla JavaScript |
| Data       | Student Social Media & Mental Health dataset |

## Project structure

```
.
├── ML_Project.ipynb                                  # Data exploration, preprocessing & model training
├── Mental_Health_Model.pkl                           # Trained model, loaded by the API
├── Student Social Media And Mental Health Impact...  # Source dataset
├── main.py                                           # FastAPI app (/predict endpoint)
├── requirements.txt                                  # Python dependencies
├── index.html                                        # Frontend markup
├── style.css                                         # Frontend styling
├── script.js                                         # Frontend logic (calls the API)
└── README.md
```

## Getting started

### 1. Backend (API)

```bash
# clone the repo
git clone https://github.com/Ab3229/student-mental-health-predictor.git
cd student-mental-health-predictor

# install dependencies
pip install -r requirements.txt

# run the API
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The API will be live at `http://127.0.0.1:8000`, with interactive docs at `http://127.0.0.1:8000/docs`.

### 2. Frontend

Open `index.html` directly in a browser, or serve the folder with a simple static server:

```bash
python -m http.server 5500
```

Then visit `http://127.0.0.1:5500`. The frontend calls the API at `http://127.0.0.1:8000/predict`, so keep the backend running while using it.

## API reference

**POST** `/predict`

Request body:

```json
{
  "age": 20,
  "gender": "Male",
  "country": "India",
  "academic_level": "Undergraduate",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Entertainment",
  "avg_daily_usage_hours": 4.0,
  "daily_unlocks": 60,
  "study_hours": 3.0,
  "physical_activity_hours": 1.0,
  "sleep_hours_per_night": 7.0,
  "stress_level": "Medium"
}
```

Response:

```json
{
  "predicted_mental_health_score": 6.78
}
```

## Disclaimer

This tool provides an estimate based on statistical patterns in survey data — it is **not a medical or diagnostic tool**. If you're struggling, please reach out to someone you trust or a mental health professional.

## Author

**Abhishek Agrawal** — [github.com/Ab3229](https://github.com/Ab3229)
