import matplotlib.pyplot as plt
import json

# JSON payload as a string for the example
with open('../data/data.json') as f:
  # Convert JSON payload to dictionary
  data = json.loads(f.read())

# Assuming the dict keys are dates and each dict contains counts
dates = list(data.keys())
pulls_data = [sum(values.values()) for values in data.values()]

# Plotting
plt.figure(figsize=(10, 6))
plt.plot(dates, pulls_data, marker='o', linestyle='-', color='b')

plt.title('Total Pulls Over Time')
plt.xlabel('Date')
plt.ylabel('Pulls')
plt.xticks(rotation=45)
plt.tight_layout()

# Show the plot
plt.show()