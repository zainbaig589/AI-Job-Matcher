from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression


# Training data
texts = [
    "python machine learning pandas numpy",
    "python fastapi backend api development",
    "html css javascript frontend web development",
    "photoshop graphic design illustrator",
    "seo content marketing keywords",
    "python machine learning tensorflow scikit learn",
]

labels = [
    1,
    1,
    0,
    0,
    0,
    1,
]


# Convert text into numbers
vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(texts)


# Train the ML model
model = LogisticRegression()

model.fit(X, labels)


# Test the model
resume = """
Python developer with experience in machine learning,
pandas, numpy and scikit-learn.
"""

job = """
We are looking for a Python machine learning developer
with experience in pandas and scikit-learn.
"""

text = resume + " " + job

prediction = model.predict(
    vectorizer.transform([text])
)

probability = model.predict_proba(
    vectorizer.transform([text])
)

print("Prediction:", prediction[0])
print("Probability:", probability)