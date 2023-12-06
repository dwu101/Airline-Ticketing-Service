from datetime import datetime, timedelta

print(((datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d') + " 12:00:00")[:10])

print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))