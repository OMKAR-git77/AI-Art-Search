import os, sys

# 🧭 Add project root (where main.py, database.py, models.py live) to Python path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
sys.path.insert(0, PROJECT_ROOT)
print("🧭 Added project root to path:", PROJECT_ROOT)

import json
import numpy as np
from datetime import datetime
from sqlalchemy.orm import Session
from sklearn.metrics.pairwise import cosine_similarity
from database import SessionLocal
from models import Embedding, DataQualityAudit



print("🧭 Added project root to path:", PROJECT_ROOT)

# ────────────────────────────────────────────────
# Connect to Database
# ────────────────────────────────────────────────
print("🗄️ Connecting to database...")
db: Session = SessionLocal()

# ────────────────────────────────────────────────
# Load all embeddings
# ────────────────────────────────────────────────
print("📥 Fetching embeddings from database...")
embs = db.query(Embedding).all()

if not embs:
    print("⚠️ No embeddings found in database. Please upload artworks first.")
    exit(0)

# Parse embeddings into vectors
vectors = []
for e in embs:
    try:
        # Handle both list and JSON-string cases
        if isinstance(e.vector, str):
            vec_dict = json.loads(e.vector)
        elif isinstance(e.vector, list):
            vec_dict = {"style": e.vector}  # assume it’s just the style vector
        else:
            vec_dict = e.vector  # already a dict maybe

        style_vec = np.array(vec_dict.get("style", []), dtype=np.float32)

        if len(style_vec) > 0:
            vectors.append(style_vec)
    except Exception as ex:
        print(f"⚠️ Failed to parse embedding ID {e.id}: {ex}")

if not vectors:
    print("❌ No valid vectors loaded. Check your database content.")
    exit(1)

vectors = np.stack(vectors)
print(f"✅ Loaded {len(vectors)} embeddings with dim={vectors.shape[1]}")

# ────────────────────────────────────────────────
# Compute Basic Metrics
# ────────────────────────────────────────────────
norms = np.linalg.norm(vectors, axis=1)
avg_norm = float(np.mean(norms))
std_norm = float(np.std(norms))
invalid_embeddings = len([n for n in norms if n < 0.5])
valid_embeddings = len(vectors) - invalid_embeddings

# ────────────────────────────────────────────────
# Cosine Similarity Check (sample)
# ────────────────────────────────────────────────
sample_size = min(100, len(vectors))
sample_vectors = vectors[:sample_size]
similarity_matrix = cosine_similarity(sample_vectors, sample_vectors)
avg_similarity = float(np.mean(similarity_matrix))
std_similarity = float(np.std(similarity_matrix))

print("\n📊 Evaluation Results:")
print(f"• Total embeddings:     {len(vectors)}")
print(f"• Valid embeddings:     {valid_embeddings}")
print(f"• Invalid embeddings:   {invalid_embeddings}")
print(f"• Avg norm:             {avg_norm:.4f}")
print(f"• Std of norms:         {std_norm:.4f}")
print(f"• Avg cosine similarity (sample): {avg_similarity:.4f}")
print(f"• Std of similarity:    {std_similarity:.4f}")

# ────────────────────────────────────────────────
#  Save to DataQualityAudit Table
# ────────────────────────────────────────────────
audit = DataQualityAudit(
    total_embeddings=len(vectors),
    valid_embeddings=valid_embeddings,
    invalid_embeddings=invalid_embeddings,
    avg_norm=avg_norm,
    norm_std=std_norm,
    timestamp=datetime.utcnow(),
    status="OK" if std_norm < 0.05 else "WARNING"
)
db.add(audit)
db.commit()
print("💾 Saved metrics to data_quality_audit table.")

# ────────────────────────────────────────────────
# Export results to CSV
# ────────────────────────────────────────────────
import pandas as pd
df = pd.DataFrame([
    {
        "timestamp": datetime.utcnow(),
        "total_embeddings": len(vectors),
        "valid_embeddings": valid_embeddings,
        "invalid_embeddings": invalid_embeddings,
        "avg_norm": avg_norm,
        "norm_std": std_norm,
        "avg_similarity": avg_similarity,
        "std_similarity": std_similarity,
    }
])
os.makedirs("reports", exist_ok=True)
csv_path = os.path.join("reports", "embedding_quality.csv")
df.to_csv(csv_path, index=False)
print(f"🧾 Results exported to {csv_path}")

db.close()
print("✅ Evaluation completed successfully.")
