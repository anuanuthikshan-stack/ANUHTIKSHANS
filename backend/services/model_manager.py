import os
import joblib
from typing import Any, Optional

SAVED_MODELS_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "saved_models")
)
os.makedirs(SAVED_MODELS_DIR, exist_ok=True)

def save_trained_model(model_obj: Any, model_name: str, plant: str) -> str:
    """Saves serialized model to saved_models directory."""
    filename = f"{model_name.lower()}_{plant.lower()}.joblib"
    filepath = os.path.join(SAVED_MODELS_DIR, filename)
    joblib.dump(model_obj, filepath)
    return filepath

def load_trained_model(model_name: str, plant: str) -> Optional[Any]:
    """Loads serialized model if it exists."""
    filename = f"{model_name.lower()}_{plant.lower()}.joblib"
    filepath = os.path.join(SAVED_MODELS_DIR, filename)
    if os.path.exists(filepath):
        return joblib.load(filepath)
    return None
