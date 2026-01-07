from weaviate import Client
import os
import json

WEAVIATE_URL = os.getenv("WEAVIATE_URL", "http://weaviate:8080")
client = Client(WEAVIATE_URL)

res = client.query.aggregate("ArtEmbedding").with_meta_count().do()
count = res["data"]["Aggregate"]["ArtEmbedding"][0]["meta"]["count"]
print("Total objects in Weaviate:", count)