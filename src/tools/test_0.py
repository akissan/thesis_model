import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

# n = 1    # number of trials
# p = 0.5  # probability of success
# sample = np.random.binomial(n, p, 100)
# plt.hist(sample, bins=10)

df = pd.read_json('test_0.json')

# print(df)

# weights = df.toList()

plt.hist(df, bins=20)
plt.show()