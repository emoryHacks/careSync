# utils/counter.py
from models.db import mongo

def get_next_user_id():
    counter = mongo.db.counters.find_one_and_update(
        {"_id": "user_id"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True
    )
    return counter["seq"]