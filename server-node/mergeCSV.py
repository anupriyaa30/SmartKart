import os
import pandas as pd

# Path to the folder containing CSV files
folder_path = 'Products_300'

# Get a list of all CSV files in the folder
csv_files = [f for f in os.listdir(folder_path) if f.endswith('.csv')]

# Initialize a DataFrame to hold the combined data
combined_data = pd.DataFrame()

# Iterate through each CSV file
for idx, file_name in enumerate(csv_files):
    file_path = os.path.join(folder_path, file_name)
    # Read the first 70 rows from each file
    data = pd.read_csv(file_path, nrows=70)
    
    if idx == 0:
        # For the first file, store the header
        header = data.columns
        combined_data = data
    else:
        # For subsequent files, ensure the columns match the header of the first file
        data = data[header]
        combined_data = pd.concat([combined_data, data], ignore_index=True)

# Write the combined data to a new CSV file
output_file_path = 'C:\\Users\\piyus\\OneDrive\\Desktop\\Codelab\\Dev\\smartkart\\server-node\products_70.csv'
combined_data.to_csv(output_file_path, index=False)

print("Combined data has been written to", output_file_path)
