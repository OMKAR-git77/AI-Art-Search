# post_embedding_validation.py
from sqlalchemy.orm import Session
from models import Artwork, Embedding
from datetime import datetime
import json
import numpy as np

def validate_post_embedding_data(db: Session):
    results = {
        "checked": 0,
        "passed": 0,
        "failed": 0,
        "missing_embeddings": [],
        "orphan_embeddings": [],
        "invalid_vectors": []
    }

    # 1️⃣ Check that every artwork has an embedding
    artworks = db.query(Artwork).all()
    embeddings = db.query(Embedding).all()

    artwork_ids = {a.id for a in artworks}
    embedding_ids = {e.artwork_id for e in embeddings if e.artwork_id is not None}

    results["checked"] = len(artworks)

    # Missing embedding for existing artwork
    missing = artwork_ids - embedding_ids
    results["missing_embeddings"] = list(missing)

    # Orphan embedding (no corresponding artwork)
    orphan = embedding_ids - artwork_ids
    results["orphan_embeddings"] = list(orphan)

    # 2️⃣ Validate each embedding vector
    for e in embeddings:
        try:
            vec = e.vector
            if isinstance(vec, str):
                vec = json.loads(vec)
            if not isinstance(vec, list) or len(vec) == 0:
                raise ValueError("Empty or invalid vector")
            if np.isnan(np.sum(vec)):
                raise ValueError("Vector contains NaN")
        except Exception:
            results["failed"] += 1
            results["invalid_vectors"].append(e.id)
        else:
            results["passed"] += 1

    # 3️⃣ Print summary
    print("✅ Post-Embedding Validation Report")
    print(f"Total Artworks Checked: {results['checked']}")
    print(f"✔️ Passed: {results['passed']}  ❌ Failed: {results['failed']}")
    print(f"🧩 Missing Embeddings: {len(results['missing_embeddings'])}")
    print(f"👻 Orphan Embeddings: {len(results['orphan_embeddings'])}")

    return results
