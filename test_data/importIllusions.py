import numpy as np 
import pandas as pd
import os
import requests

with open('illusionTable.tsv', 'r', encoding='utf-8-sig') as f:
  raw_df = pd.read_csv(f, sep='\t')
  raw_df['element'] = raw_df[raw_df.columns[2:11]].apply(
    lambda x: '|'.join(x.dropna().astype(str)),
    axis=1
  )
  raw_df['effect'] = raw_df[raw_df.columns[11:17]].apply(
    lambda x: '|'.join(x.dropna().astype(str)),
    axis=1
  )
  raw_df.drop(columns=raw_df.columns[[3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 18]], inplace=True)
  res = requests.post('http://localhost:4000/import', data=raw_df.to_csv(sep='\t').encode('utf-8'), headers={'Content-Type': 'text/plain'})
  print(res.text)